import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { User } from '../app.model';

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

function idChecker(control: AbstractControl)
{
  var id = /[u]\d+/;
  if (id.test(control.value))
  {
    return null;
  }

  return { idChecker: true };
}

function nameChecker(control: AbstractControl)
{
  var name = /\w+\s*\w*/
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
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit
{
  constructor(private appService: AppService) { }
  @Input({ required: true }) userId!: string;
  @Output() close = new EventEmitter<boolean>();
  isFetching = signal(false);
  user!: User;
  closing = false;
  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1), nameChecker]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), passwordChecker]
    }),
    confirmpassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), passwordChecker]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5), Validators.email]
    }),

    number: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), numberChecker]
    }),
    role: new FormControl<'admin' | 'emp' | 'security'>('emp', {
      validators: [Validators.required]
    })
  })
  ngOnInit()
  {
    this.isFetching.set(true);
    if (this.userId)
    {
      this.user = this.appService.getUser(this.userId);
      this.isFetching.set(false);
      this.form.patchValue({
        name: this.user.name,
        email: this.user.email,
        number: this.user.number,
        role: this.user.role
      })
    }
  }
  roles = ['admin', 'emp', 'security']


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
    if (this.closing)
    {
      return;
    }
    this.user.name = this.form.controls.name.value!;
    this.user.role = this.form.controls.role.value!;
    this.user.password = this.form.controls.password.value!;
    this.user.email = this.form.controls.email.value!;
    this.user.number = this.form.controls.number.value!;
    this.appService.updateUser(this.user).subscribe();
    this.form.reset;
    this.close.emit(true);
  }
  onClose()
  {
    this.closing = true;
    this.close.emit(false);
  }
}
