import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { User } from '../app.model';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateUserComponent } from "../update-user/update-user.component";
import { FormsModule } from '@angular/forms';
import { UserOperationsComponent } from "../user-operations/user-operations.component";

@Component({
    selector: 'app-user-info',
    standalone: true,
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
    imports: [UpdateUserComponent, FormsModule, UserOperationsComponent]
})
export class UserInfoComponent implements OnInit{
  constructor(private appService: AppService, private destroyRef: DestroyRef, private toastr: ToastrService){}
  operatingUser = signal<User>({ id: '', name: '', role: 'emp', number: '', email: '', password: '' });
  isFetching = signal(false);
  currUser!: string;
  ngOnInit()
  {
    this.isFetching.set(true);
    const subscription = this.appService.fetchUsers().subscribe({
      complete: () =>
      {
        this.operatingUser.set(this.appService.getCurrUser());
        this.isFetching.set(false)
      }
    })
    this.destroyRef.onDestroy(() =>
    {
      subscription.unsubscribe();
    })
  }
}
