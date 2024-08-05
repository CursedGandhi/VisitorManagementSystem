import { Component, EventEmitter, Input, Output } from '@angular/core';
import { type Visitor } from '../app.model';
import { ViewVisitorComponent } from "../view-visitor/view-visitor.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VisitorOperationsService } from '../visitor-operations/visitor-operations.service';
import { DatePipe } from '@angular/common';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [ViewVisitorComponent, ReactiveFormsModule],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent
{
  constructor(private visitorService: VisitorOperationsService, private datePipe: DatePipe) { }
  @Input({ required: true }) visitor!: Visitor;
  @Output() close = new EventEmitter<boolean>();
  closing = false;
  imageDataUrl!: string;
  imageFile: File | null = null;
  form = new FormGroup({
    sec_remarks: new FormControl('', {
      validators: []
    }),
    no_vis: new FormControl('1', {
      validators: []
    })
  })
  onFileSelected(event: any)
  {
    const file: File = event.target.files[0];

    if (file)
    {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) =>
      {
        this.imageDataUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit()
  {
    if (this.closing)
      return;
    this.visitor.sec_remarks = this.form.value.sec_remarks!;
    this.visitor.no_vis = parseInt(this.form.value.no_vis!);
    const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss');
    this.visitor.checkIn = currentDateAndTime!;
    this.visitorService.updateVisitor(this.visitor).subscribe();
    this.generatepdf()
    this.close.emit(true);
  }
  onClose()
  {
    this.closing = true;
    this.close.emit(false);
  }
  generatepdf()
  {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [4, 2]
    });

    const logo = new Image();
    logo.src = 'logo.jpg';
    console.log('hello')
    pdf.addImage(logo, 'JPEG', 1, 0.2, 2, 2);
    const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
    const img = new Image();
    pdf.setFontSize(12);
    pdf.setFillColor(173, 216, 230)
    pdf.rect(0, 0, 4, 0.35, 'F');
    pdf.setDrawColor(173, 216, 230)
    pdf.rect(0, 0, 4, 2, 'S')
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.02)
    pdf.rect(0.1, 0.35, 3.8, 1.55)
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.04)
    pdf.rect(0, 0, 4, 2)
    pdf.setTextColor(0, 0, 0)
    pdf.text("ENTRY PERMIT - VISITOR", 1, 0.3);


    pdf.setFontSize(13);
    pdf.text(this.visitor.name, 1.3, 0.7);
    pdf.setFontSize(10);
    pdf.text("Visitor Company: " + this.visitor.company, 1.3, 1);

    pdf.text("Contact: " + this.visitor.number, 1.3, 1.2);
    pdf.text("Email Address: " + this.visitor.email, 1.3, 1.4);
    pdf.text("Date of Visit: " + currentDateAndTime, 1.3, 1.6);
    
    
 
    
      img.src = this.imageDataUrl;
      img.onload = () =>
      {
        const imgWidth = 1; 
        const imgHeight = 1; 

        pdf.addImage(img, 'JPEG', 0.2, 0.6, imgWidth, imgHeight);
        var base64string = pdf.output('datauristring');
        this.debugBase64(base64string);
      };


  }
  debugBase64(base64URL: string)
  {
    var win = window.open();
    win?.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
  }
}
