import { DestroyRef, Injectable, OnInit, signal } from '@angular/core';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { User } from './app.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthService
{

  isFetching = signal(false);

  constructor(private cookieService: CookieService, private http: HttpClient, private appService: AppService, private router: Router, private destroyRef: DestroyRef, private toastr: ToastrService)
  {
    if(cookieService.check('user'))
      this.isAuthenticated=true;
  }


  private isAuthenticated = false;
  async signIn(email: string, password: string): Promise<boolean>
  {
    this.isFetching.set(true);
    const subscription = this.appService.authCheck(email, password).subscribe({ complete: () => {
      this.isFetching.set(false)}})
    this.destroyRef.onDestroy(() =>
    {
      subscription.unsubscribe();
    })
    try{
      await lastValueFrom(this.appService.authCheck(email, password));
      let user = this.appService.getCurrUser();
      if(user!=null){
        this.cookieService.set('user', JSON.stringify(user));
        this.toastr.success('Login Successful')
        this.isAuthenticated = true;
        return true;
      }
      else
        return false;
    }
    catch(error){
      this.isFetching.set(false);
      this.toastr.error('Sign In failed');
      return false;
    }
  }
  isAuthenticatedUser(): boolean
  {
    return this.isAuthenticated;
  }

  logout()
  {
    this.cookieService.delete('user');
    this.isAuthenticated = false;
  }
}
