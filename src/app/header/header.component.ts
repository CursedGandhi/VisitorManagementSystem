import { Component } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { SidebarModule } from 'primeng/sidebar';
import { UserInfoComponent } from "../user-info/user-info.component";
import { AppService } from '../app.service';
import { slideInAnimation } from '../animation';
@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    imports: [RouterModule, SidebarModule, UserInfoComponent],
    animations: [
      slideInAnimation
    ]
})
export class HeaderComponent
{
  constructor(private authService: AuthService, private router: Router, private appService: AppService, private contexts: ChildrenOutletContexts) { }
  sidebarVisible = false

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
  
  onSignOut()
  {
    this.authService.logout();
    this.router.navigate(['/home'])
  }
  isLogin()
  {
    if (this.router.url === '/home')
      return true;
    return false;
  }
  isNotSecurity()
  {
    const user = this.appService.getCurrUser()
    if(user.role === 'security')
      return false

    if(user.role === 'emp')
      return false
    return true
  }
}
