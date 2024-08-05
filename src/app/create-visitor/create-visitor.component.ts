import { Component, DestroyRef, EventEmitter, Input, Output, signal } from '@angular/core';
import { User, Visitor } from '../app.model';
import { AbstractControl, FormControl, FormGroup, NgForm, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { VisitorOperationsService } from '../visitor-operations/visitor-operations.service';
import { VisitorOperationsComponent } from '../visitor-operations/visitor-operations.component';
import { firstValueFrom } from 'rxjs';

function dateChecker(control: AbstractControl)
{
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  var date = mm + '/' + dd + '/' + yyyy; 
  var currDate = new Date(date);
  var givenDate = new Date(control.value);
  if(givenDate>=currDate)
    return null;
  return { dateChecker: true };
}

function panChecker(control:AbstractControl)
{
  var pan = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
  if(pan.test(control.value))
    return null;
  return { panChecker: true };
}

function aadharChecker(control:AbstractControl)
{
  var number = /\d+/;
  if (number.test(control.value))
  {
    return null;
  }

  return { aadharChecker: true };
}

function passportChecker(control: AbstractControl)
{
  var passport = /^[A-Z]{1}[0-9]{7}$/
  if(passport.test(control.value))
    return null;
  return { passportChecker: false};
}

function nameChecker(control: AbstractControl)
{
  var name = /^[a-zA-Z]+\s?[a-zA-Z]*/
  if (name.test(control.value))
  {
    return null;
  }

  return { nameChecker: true };
}

function numberChecker(control: AbstractControl)
{
  var number = /\d+/;
  if (number.test(control.value))
  {
    return null;
  }

  return { numberChecker: true };
}

@Component({
  selector: 'app-create-visitor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-visitor.component.html',
  styleUrl: './create-visitor.component.css'
})
export class CreateVisitorComponent
{
  closing = false;
  constructor(private appService: AppService, private destroyRef: DestroyRef, private visitorService: VisitorOperationsService, private visitorOperations: VisitorOperationsComponent)
  {

  }
  submitted = false;
  operatingUser = signal<User>({ id: '', name: '', role: 'emp', number: '', email: '', password: '' });

  visitor?: Visitor;
  @Output() close = new EventEmitter<boolean>();
  @Input({ required: true }) nextId!: string;
  isPosting = signal(false);


  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1), nameChecker]
    }),
    date: new FormControl('', {
      validators: [Validators.required, dateChecker]
    }),
    number: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), numberChecker]
    }),
    email: new FormControl('', {
      validators: [Validators.required,Validators.email]
    }),
    doc:new FormControl<'aadhar'|'pan'|'passport'>('aadhar',{
      validators:[Validators.required,]
    }),
    doc_no:new FormControl('',{
      validators:[Validators.required, aadharChecker, Validators.minLength(12), Validators.maxLength(12)]
    }),
    company:new FormControl('',{
      validators:[Validators.required]
    }),
    is_remarks: new FormControl('', {
      validators: []
    })
  }
  )
    ngOnInit(){
      const subscription1 = this.appService.fetchUsers().subscribe({ complete: () => { this.operatingUser.set(this.appService.getCurrUser()); } })
      this.form.get('doc')!.valueChanges.subscribe(val => {
        if (this.form.controls.doc.value == 'pan') {
          this.form.controls['doc_no'].setValidators([panChecker, Validators.minLength(10), Validators.maxLength(10)]);
        } 
        else if(this.form.controls.doc.value == 'passport'){
          this.form.controls['doc_no'].setValidators([passportChecker, Validators.minLength(8)]);
        }
        else{
          this.form.controls['doc_no'].setValidators([aadharChecker, Validators.minLength(12), Validators.maxLength(12)]);
        }
        this.form.controls['doc_no'].updateValueAndValidity();
      });
    }
  
  get nameIsInvalid()
  {
    return this.form.controls.name.touched && this.form.controls.name.dirty && this.form.controls.name.invalid;
  }

  get dateIsInvalid()
  {
    return this.form.controls.date.touched && this.form.controls.date.dirty && this.form.controls.date.invalid;
  }

  get numberIsInvalid()
  {
    return this.form.controls.number.touched && this.form.controls.number.dirty && this.form.controls.number.invalid;
  }

  get emailIsInvalid()
  {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid;
  }

  get docIsInvalid()
  {
    return this.form.controls.doc_no.touched && this.form.controls.doc_no.dirty && this.form.controls.doc_no.invalid;
  }

  async onSubmit()
  {
    console.log(this.nextId);
    if (this.closing)
    {
      return;
    }

    this.submitted = true;
    this.visitor = {
      name: this.form.value.name!,
      id: this.nextId,
      date: this.form.value.date!,
      checkIn: "",
      number: this.form.value.number!,
      checkOut: "",
      email:this.form.value.email!,
      doc:this.form.value.doc!,
      doc_no:this.form.value.doc_no!,
      company:this.form.value.company!,
      user:this.operatingUser().id,
      is_remarks: this.form.value.is_remarks!,
      sec_remarks: null,
      no_vis:1
    }
    this.isPosting.set(true);
    const subscription = this.visitorService.addVisitor(this.visitor).subscribe({error: () => {this.form.reset(); this.isPosting.set(false);
      this.close.emit(true);}});
    this.destroyRef.onDestroy(() =>
    {
      subscription.unsubscribe();
    })
    
  }
  onClose()
  {
    this.closing = true;
    this.form.reset();
    this.submitted = false;
    this.close.emit(false);
  }
}
