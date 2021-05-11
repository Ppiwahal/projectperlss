import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../core/authentication/authentication.service';
import {User} from '../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() isCheckRoute: any;
  currentUser: User;
  loginForm: FormGroup;
  error = '';
  returnUrl: string;
  isLogout = false;

  constructor( private fb: FormBuilder,
               private route: ActivatedRoute,
               private router: Router,
               private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.authenticationService.isLogout) {
      this.isLogout = this.authenticationService.isLogout.value;
    }
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || 'ltss/home';
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([this.returnUrl]);
    }
  }

  get loginFormDetail() { return this.loginForm.controls; }

  onSubmit() {
    console.log(this.loginFormDetail);
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticationService.login(this.loginFormDetail.username.value, this.loginFormDetail.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.authenticationService.currentUser.subscribe(userInformation => this.currentUser = userInformation);
          console.log(this.currentUser);
        },
        error => {
          this.error = error;
        });
  }
}
