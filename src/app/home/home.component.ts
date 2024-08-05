import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { FloatLabelModule } from 'primeng/floatlabel'

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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FloatLabelModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent
{

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private appService: AppService) { }

  isFetching = this.authService.isFetching;

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required, passwordChecker]
    })
  })


  get emailIsInvalid()
  {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid;
  }

  get passwordIsInvalid()
  {
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid;
  }

  async onSubmit()
  {
    try{
    const success = await this.authService.signIn(this.form.controls.email.value!, this.form.controls.password.value!)
    if (success)
    {
      if(!(this.appService.getUserRole()==='admin'))
        this.router.navigate(['/visitors']);
      else
        this.router.navigate(
          ['/users']
        );
    }
    else
      this.toastr.error('Incorrect email/password')
  }
  catch(error)
  {
    this.toastr.error("An error occurred");
  }
  finally
  {
    this.isFetching.set(false);
  }
}
}
