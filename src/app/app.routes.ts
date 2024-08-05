import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserOperationsComponent } from './user-operations/user-operations.component';
import { authGuard } from './auth.guard';
import { VisitorOperationsComponent } from './visitor-operations/visitor-operations.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'users', component: UserOperationsComponent, canActivate: [authGuard], data: {animation: 'openClosePage'} },
    { path: 'visitors', component: VisitorOperationsComponent, canActivate: [authGuard],  data: {animation: 'openClosePage'} }
];
