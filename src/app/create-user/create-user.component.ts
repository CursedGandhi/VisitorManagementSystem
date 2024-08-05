import { Component, DestroyRef, EventEmitter, HostBinding, Input, Output, signal } from '@angular/core';
import { User } from '../app.model';
import { AbstractControl, FormControl, FormGroup, NgForm, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { animate, query, style, transition, trigger } from '@angular/animations';



function passwordChecker(control: AbstractControl)
{
  var spChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var word = /\w+/
  var digit = /\d+/
  if (spChar.test(control.value) && word.test(control.value) && digit.test(control.value))
  {
    return null;
  }

  return { passwordChecker: true };
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

function idChecker(control: AbstractControl)
{
  var id = /[u]\d+/;
  if (id.test(control.value))
  {
    return null;
  }

  return { idChecker: true };
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
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent
{
  closing = false;
  constructor(private appService: AppService, private destroyRef: DestroyRef)
  {

  }
  submitted = false;
  user?: User;
  roles = ['admin', 'emp', 'security']
  @Output() close = new EventEmitter<boolean>();
  @Input({ required: true }) nextId!: string;
  isPosting = signal(false);

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1), nameChecker]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5), Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), passwordChecker]
    }),
    confirmpassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), passwordChecker]
    }),
    number: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), numberChecker]
    }),
    role: new FormControl<'admin' | 'emp' | 'security'>('emp', {
      validators: [Validators.required]
    })
  }
  )

  get nameIsInvalid()
  {
    return this.form.controls.name.touched && this.form.controls.name.dirty && this.form.controls.name.invalid;
  }

  get emailIsInvalid()
  {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid;
  }

  get numberIsInvalid()
  {
    return this.form.controls.number.touched && this.form.controls.number.dirty && this.form.controls.number.invalid;
  }

  get passwordIsInvalid()
  {
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid;
  }

  get confirmPasswordIsInvalid()
  {

    return this.form.controls.confirmpassword.touched && this.form.controls.confirmpassword.dirty && this.form.controls.confirmpassword.invalid;
  }

  onSubmit()
  {
    console.log(this.nextId);
    if (this.closing)
    {
      return;
    }

    this.submitted = true;
    this.user = {
      name: this.form.value.name!,
      id: this.nextId,
      email: this.form.value.email!,
      role: this.form.value.role!,
      number: this.form.value.number!,
      password: this.form.value.password!
    }
    this.isPosting.set(true);
    const subscription = this.appService.addUser(this.user).subscribe({error: (err)=>{
      this.form.reset();
      this.isPosting.set(false);
      this.close.emit(true);
    }});
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
