import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { AppService } from '../app.service';
import { VisitorOperationsService } from './visitor-operations.service';
import { FormsModule, NgForm } from '@angular/forms';
import { User, Visitor } from '../app.model';
import { CreateVisitorComponent } from "../create-visitor/create-visitor.component";
import { DatePipe } from '@angular/common';
import { UpdateUserComponent } from "../update-user/update-user.component";
import { ToastrService } from 'ngx-toastr';
import { ViewVisitorComponent } from "../view-visitor/view-visitor.component";
import { CheckinComponent } from "../checkin/checkin.component";
import { NgClass } from '@angular/common';
import { debounce } from 'lodash';
@Component({
  selector: 'app-visitor-operations',
  standalone: true,
  templateUrl: './visitor-operations.component.html',
  styleUrl: './visitor-operations.component.css',
  imports: [FormsModule, CreateVisitorComponent, DatePipe, UpdateUserComponent, ViewVisitorComponent, CheckinComponent, NgClass]
})


export class VisitorOperationsComponent implements OnInit
{
  constructor(private appService: AppService, private destroyRef: DestroyRef, private visitorService: VisitorOperationsService, private datePipe: DatePipe, private toastr: ToastrService)
  {
    this.debouncedGetVisitors = debounce(this.getVisitors, 300);
  }
  isFetching = signal(false);
  operatingUser = signal<User>({ id: '', name: '', role: 'emp', number: '', email: '', password: '' });
  visitors = this.visitorService.loadedVisitors;
  visitor !: Visitor;
  currVisitor!: string;
  updating = false;
  deleting = false;
  creating = signal(false);
  popo = false;
  newId = signal<string>('');
  checkingIn = false;
  pages = [1];
  currPage = 1;
  sortBy = signal<'name' | 'company' | 'date' | 'checkIn' | 'checkOut' | 'number'>('date');
  sortOrder = signal<'ASC' | 'DESC'>('DESC');
  sort = signal<boolean>(false);
  ngOnInit()
  {
    this.appService.getOperatingUser();
    this.isFetching.set(true);
    this.operatingUser.set(this.appService.getCurrUser());
    if (this.operatingUser().role == 'admin' || this.operatingUser().role == 'security')
    {
      const subscription2 = this.visitorService.fetchVisitorsByPage(this.currPage - 1, this.sortBy(), this.sortOrder()).subscribe({
        complete: () =>
        {
          this.isFetching.set(false);
          this.pages = [1];
          for (let i = 1; i < this.visitorService.noOfPages; i++)
          {
            this.pages.push(i + 1);
          }
        }
      })
      this.destroyRef.onDestroy(() =>
      {
        subscription2.unsubscribe();
      })
    }
    else
    {
      const subscription2 = this.visitorService.fetchVisitorsByPageAndUser(this.operatingUser().id, this.currPage - 1, this.sortBy(), this.sortOrder()).subscribe({
        complete: () =>
        {
          this.isFetching.set(false);
          for (let i = 1; i < this.visitorService.noOfPages; i++)
          {
            this.pages.push(i + 1);
          }
        }
      })
      this.destroyRef.onDestroy(() =>
      {
        subscription2.unsubscribe();
      })
    }
  }
  searchText: string = "";

  getVisitors()
  {
    this.appService.getOperatingUser();
    this.isFetching.set(true);
    this.operatingUser.set(this.appService.getCurrUser());
    if (this.operatingUser().role == 'admin' || this.operatingUser().role == 'security')
    {
      const subscription2 = this.visitorService.fetchVisitorsByPageAndSearchText(this.currPage - 1, this.sortBy(), this.sortOrder(), this.searchText).subscribe({
        complete: () =>
        {
          this.isFetching.set(false);
          this.pages = [1];
          for (let i = 1; i < this.visitorService.noOfPages; i++)
          {
            this.pages.push(i + 1);
          }
        }
      })
      this.destroyRef.onDestroy(() =>
      {
        subscription2.unsubscribe();
      })
    }
    else
    {
      const subscription2 = this.visitorService.fetchVisitorsByPageAndUserAndSearchText(this.operatingUser().id, this.currPage - 1, this.sortBy(), this.sortOrder(), this.searchText).subscribe({
        complete: () =>
        {
          this.isFetching.set(false);
          for (let i = 1; i < this.visitorService.noOfPages; i++)
          {
            this.pages.push(i + 1);
          }
        }
      })
      this.destroyRef.onDestroy(() =>
      {
        subscription2.unsubscribe();
      })
    }
  }

  debouncedGetVisitors!: () => void;

  visitorIdGen()
  {
    this.isFetching.set(true);
    const subscription2 = this.visitorService.getVisitorID().subscribe({
      complete: () =>
      {
        this.newId.set(this.visitorService.newID());
        this.creating.set(true);
        this.isFetching.set(false);
      }
    })

    this.destroyRef.onDestroy(() =>
    {
      subscription2.unsubscribe();
    })
  }

  onSearchChange()
  {
    this.debouncedGetVisitors();
  }


  onCheckIn(id: string)
  {
    this.visitor = this.visitorService.getVisitor(id);
    this.checkingIn = true;
  }

  onCreate()
  {
    this.visitorIdGen();
  }

  onCloseCreate(created: boolean)
  {
    this.creating.set(false);
    if (created)
    {
      this.ngOnInit();
      this.changeSorting(this.sortBy());
      this.toastr.success("Visitor succesfully created");
    }
  }

  onCheckOut(id: string)
  {
    let visitor = this.visitorService.getVisitor(id);
    const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss');
    visitor.checkOut = currentDateAndTime!;
    this.visitorService.updateVisitor(visitor).subscribe();
    this.toastr.error("Visitor successfully checked-out")
  }

  onView(id: string)
  {
    this.visitor = this.visitorService.getVisitor(id);
    this.popo = true;
  }

  onClosePopo()
  {
    this.popo = false;
  }

  onDelete(visitorId: string)
  {
    this.toastr.error('Visitor was successfully deleted');
    this.deleting = true;
    if (this.visitorService.loadedVisitors().length === 1)
      this.visitorService.removeVisitor(visitorId).subscribe({ error: (err) => { this.currPage--; this.ngOnInit(); } });
    this.visitorService.removeVisitor(visitorId).subscribe({ error: (err) => { this.ngOnInit(); } });
  }

  canCheckIn(id: string)
  {
    const visitor = this.visitorService.getVisitor(id);
    if (visitor.checkIn == '')
    {
      return false;
    }
    return true;
  }

  canCheckOut(id: string)
  {
    const visitor = this.visitorService.getVisitor(id);
    if (visitor.checkIn != '' && visitor.checkOut == '')
      return false;
    return true;
  }

  onCloseCheckIn(checkedIn: boolean)
  {
    this.checkingIn = false;
    if (checkedIn)
      this.toastr.success("Visitor successfully checked in");
  }

  onDownload()
  {
    this.visitorService.jsonToXML();
  }

  selectPage(pageNo: number)
  {
    this.currPage = pageNo;
    this.isFetching.set(true);
    if (this.operatingUser().role === 'admin' || this.operatingUser().role === 'security')
    {
      if (this.searchText != '')
        this.debouncedGetVisitors();
      else
      {
        const subscription2 = this.visitorService.fetchVisitorsByPage(pageNo - 1, this.sortBy(), this.sortOrder()).subscribe({ complete: () => { this.isFetching.set(false); } });
        this.destroyRef.onDestroy(() =>
        {
          subscription2.unsubscribe();
        })
      }
    }
    else
    {
      if (this.searchText != '')
        this.debouncedGetVisitors();
      else
      {
        const subscription2 = this.visitorService.fetchVisitorsByPageAndUser(this.operatingUser().id, pageNo - 1, this.sortBy(), this.sortOrder()).subscribe({ complete: () => { this.isFetching.set(false); } });
        this.destroyRef.onDestroy(() =>
        {
          subscription2.unsubscribe();
        })
      }
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
  changeSorting(value: 'name' | 'company' | 'date' | 'checkIn' | 'checkOut' | 'number')
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
    if (this.operatingUser().role == 'admin' || this.operatingUser().role == 'security')
    {
      if (this.searchText != '')
        this.debouncedGetVisitors();
      else
      {
        const subscription2 = this.visitorService.fetchVisitorsByPage(this.currPage - 1, this.sortBy(), this.sortOrder()).subscribe({ complete: () => { this.isFetching.set(false); } });
        this.destroyRef.onDestroy(() =>
        {
          subscription2.unsubscribe();
        })
      }
    }
    else
    {
      if (this.searchText != '')
        this.debouncedGetVisitors();
      else
      {
        const subscription2 = this.visitorService.fetchVisitorsByPageAndUser(this.operatingUser().id, this.currPage - 1, this.sortBy(), this.sortOrder()).subscribe({ complete: () => { this.isFetching.set(false); } });
        this.destroyRef.onDestroy(() =>
        {
          subscription2.unsubscribe();
        })
      }
    }
  }
}
