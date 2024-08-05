import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Visitor } from '../app.model';

@Component({
  selector: 'app-view-visitor',
  standalone: true,
  imports: [],
  templateUrl: './view-visitor.component.html',
  styleUrl: './view-visitor.component.css'
})
export class ViewVisitorComponent {
  @Input({required:true}) closer!: boolean;
  @Input({required:true}) visitor!: Visitor;
  @Input({required:true}) checkedIn!: boolean;
  @Output() close = new EventEmitter<void>();

  onClose(){
    this.close.emit();
  }
}
