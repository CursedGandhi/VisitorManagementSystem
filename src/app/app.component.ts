import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { AppService } from './app.service';
import { slideInAnimation } from './animation';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent
{
  title = 'CRUD';
  constructor(public appService: AppService, private contexts: ChildrenOutletContexts) { }
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
