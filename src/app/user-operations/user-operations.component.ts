import { Component, DestroyRef, Input, OnInit, signal } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../app.model';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { CreateUserComponent } from "../create-user/create-user.component";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { debounce } from 'lodash';

@Component({
  selector: 'app-user-operations',
  standalone: true,
  templateUrl: './user-operations.component.html',
  styleUrl: './user-operations.component.css',
  imports: [FormsModule, UpdateUserComponent, CreateUserComponent, NgClass],
})

export class UserOperationsComponent implements OnInit
{
  constructor(private appService: AppService, private destroyRef: DestroyRef, private toastr: ToastrService, private router: Router)
  {
    this.debouncedGetUsers = debounce(this.getUsers, 300);
  }
  isFetching = signal(false);
  operatingUser = signal<User>({ id: '', name: '', role: 'emp', number: '', email: '', password: '' });
  users = this.appService.loadedUsers;
  @Input({ required: false }) updateClicked = false;
  currUser!: string;
  updating = false;
  deleting = false;
  creating = signal(false);
  newId = signal<string>('');
  checkingIn = false;
  pages = [1];
  currPage = 1;
  sortBy = signal<'id' | 'name' | 'email' | 'role' | 'number'>('name');
  sortOrder = signal<'ASC' | 'DESC'>('DESC');
  sort = signal<boolean>(false);
  searching = signal<boolean>(false);
  ngOnInit()
  {
    this.appService.getOperatingUser();
    this.operatingUser.set(this.appService.getCurrUser());
    this.isFetching.set(true);
    const subscription = this.appService.fetchUsersByPage(this.currPage - 1, this.sortBy(), this.sortOrder()).subscribe({
      complete: () =>
      {
        this.isFetching.set(false);
        for (let i = 1; i < this.appService.noOfPages; i++)
        {
          this.pages.push(i + 1);
        }
      }
    })

    if (this.operatingUser().role == 'security')
      this.router.navigate(['/users'])

    this.destroyRef.onDestroy(() =>
    {
      subscription.unsubscribe();
    })
  }

  searchText: string = "";

  getUsers()
  {
    this.appService.getOperatingUser();
    this.operatingUser.set(this.appService.getCurrUser());
    this.isFetching.set(true);
    this.searching.set(true);
    const subscription = this.appService.fetchUsersByPageAndSearchText(this.currPage - 1, this.sortBy(), this.sortOrder(), this.searchText).subscribe({
      complete: () =>
      {
        this.isFetching.set(false);
        this.searching.set(false);
        for (let i = 1; i < this.appService.noOfPages; i++)
        {
          this.pages.push(i + 1);
        }
      }
    })
  }

  debouncedGetUsers!: () => void;

  onSearchChange()
  {
    this.debouncedGetUsers();
  }

  userIdGen()
  {
    this.isFetching.set(true);
    const subscription2 = this.appService.getUserID().subscribe({
      complete: () =>
      {
        this.newId.set(this.appService.newID());
        this.creating.set(true);
        this.isFetching.set(false);
      }
    })

    this.destroyRef.onDestroy(() =>
    {
      subscription2.unsubscribe();
    })
  }

  onUpdate(userId: string)
  {
    this.currUser = userId;
    this.updating = true;
  }
  onDelete(userId: string)
  {
    this.toastr.error('User was successfully deleted');
    this.deleting = true;
    if (this.appService.loadedUsers().length === 1)
      this.appService.removeUser(userId).subscribe({ error: (err) => { this.currPage--; this.ngOnInit(); } });
    this.appService.removeUser(userId).subscribe({ error: (err) => { this.ngOnInit(); } });
  }
  onCloseUpdate(updated: boolean)
  {
    this.updating = false;
    if (updated)
    {
      this.toastr.info('User successfully updated');
    }
  }
  onCloseDelete()
  {
    this.deleting = false;
  }
  onCreate()
  {
    this.userIdGen();
  }
  onCloseCreate(created: boolean)
  {
    this.creating.set(false);
    if (created)
      this.toastr.success("User succesfully created");
  }
  selectPage(pageNo: number)
  {
    this.currPage = pageNo;
    this.isFetching.set(true);
    if (this.searchText != '')
      this.debouncedGetUsers();

    else
    {
      const subscription2 = this.appService.fetchUsersByPage(pageNo - 1, this.sortBy(), this.sortOrder()).subscribe({ complete: () => { this.isFetching.set(false); } });
      this.destroyRef.onDestroy(() =>
      {
        subscription2.unsubscribe();
      })
    }
  }
  onNext()
  {
    if (this.currPage != this.pages.length)
    {
      this.currPage++;
      this.selectPage(this.currPage);
    }
  }
  onPrevious()
  {
    if (this.currPage > 1)
    {
      this.currPage--;
      this.selectPage(this.currPage);
    }
  }
  changeSorting(value: 'id' | 'name' | 'email' | 'role' | 'number')
  {
    if (this.sortBy() !== value)
    {
      this.sort.set(false);
    }

    else
      this.sort.set(!(this.sort()));
    this.sortOrder.set(this.sort() ? 'DESC' : 'ASC')
    this.sortBy.set(value);
    this.isFetching.set(true);
    if (this.searchText != '')
      this.debouncedGetUsers();
    else
    {
      const subscription2 = this.appService.fetchUsersByPage(this.currPage - 1, this.sortBy(), this.sortOrder()).subscribe({ complete: () => { this.isFetching.set(false); } });
      this.destroyRef.onDestroy(() =>
      {
        subscription2.unsubscribe();
      })
    }
  }
}
