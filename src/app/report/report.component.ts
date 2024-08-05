import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  ngOnInit(): void {
      let x = <HTMLInputElement>document.getElementById("flexCheckIndeterminate")!;
      x.indeterminate = true;
  }
}
