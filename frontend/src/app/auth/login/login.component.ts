import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup;
  private submitted = false;


  constructor(private authSvc: AuthService, private router: Router) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.form.disable();

    this.authSvc.login(this.form.value).subscribe({
      next: (data: any) => {
        console.log(data);
        // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // console.log(returnUrl);

        this.router.navigate(["/", "dashboard"])
      },
      error: (err: any) => {
        // console.log('error', err);
        this.form.enable();
        this.form.reset();
      },
    });
  }
}
