import { SessionTimeoutPopupComponent } from './session-timeout-popup/session-timeout-popup.component';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from './core/authentication/authentication.service';
import { User } from './core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { HttpClient } from '@angular/common/http';
import { SET_IDLE_TIMEOUT, SET_TIMEOUT_WARNING} from '../app/_shared/constants/application.constants';
import { RoutingService } from './core/services/routing/routing-service.service';
import { MatDialog } from '@angular/material/dialog';
import * as Constants from './_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const unprotectedRoutes = ["/externalreferral", "/externalreferral/extreferralConfirmation"];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, DoCheck {
  idleState = 'Not started.';
  timedOut = false;
  title = 'PERLSS';
  staticData: any;
  currentUser: User;
  currentCookieUser: any;
  currentUrl: string;
  isLoginPage = false;
  isUserLoggedIn: boolean;
  lastPing?: Date = null;
  called = false;
  matDialogRef: any;
  isCheckRoute = false;
  isCheckedUrl = false;
  isUrlChecked = true;
  isActiveUser: boolean;
  isProfileComplete:boolean;
  skipAuthCheck:boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private routingService: RoutingService
    ) {
    this.routingService.currentUrl$.subscribe(res => {
      console.log("res ",res);
      this.skipAuthCheck = unprotectedRoutes.indexOf(res) > -1;
    })
  }

  ngOnInit() {
    this.idle.setIdle(SET_IDLE_TIMEOUT);
    this.idle.setTimeout(SET_TIMEOUT_WARNING);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.authenticationService.currentUser.subscribe(userLoggedIn => {
      console.log("userLoggedIn", userLoggedIn);
      if (userLoggedIn) {
        this.idle.watch();
        this.called = false;
        this.timedOut = false;
        const pageAccessData = localStorage.getItem('PAGE_ACCESS_DATA');
        if (pageAccessData) {
          this.isUserLoggedIn = true;
          const decryptedPageAccessData = CryptoJS.AES.decrypt(pageAccessData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
          this.isProfileComplete = JSON.parse(decryptedPageAccessData).completeSw === 'Y';
          this.isActiveUser = JSON.parse(decryptedPageAccessData).statusCd === 'AC';
          console.log(" this.isActiveUser", this.isActiveUser);
        }
      } else {
        this.idle.stop();
      }
    });
    this.authenticationService.userValidate(true);
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.matDialogRef.getState());
      console.log(this.idleState);
      this.called = false;
      this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.matDialogRef.close();
      this.authenticationService.logout();
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      console.log(this.idleState);

    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
      if ( !this.called )
      {
        this.matDialogRef = this.dialog.open(SessionTimeoutPopupComponent, {
          width: '550px',
          height: 'auto',
          data: { numbers: countdown }
        });
      }
      if (this.matDialogRef && this.matDialogRef.componentInstance) {
        this.matDialogRef.componentInstance.data = {numbers: countdown};
        console.log(countdown);
      }
      this.matDialogRef.afterClosed().subscribe(isLogOut => {
        if ( isLogOut ) {
          this.authenticationService.logout();
        }
      });
      this.called = true;
    });
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
    });
  }

  ngDoCheck() {
    if (this.authenticationService.currentCookieUser) {
      this.currentCookieUser = this.authenticationService.currentCookieUser.value;
      if (this.currentUrl === '/') {
        this.currentUrl = '/login';
      }
      this.checkRoute();
    }
  }

  checkRoute() {
    if ((this.currentUrl === '/login' || this.currentUser == null) && this.currentUrl !== '/externalreferral' && !this.currentUrl.startsWith('/externalreferral/extreferralConfirmation',0) && this.currentCookieUser === 'NoCookie') {
      this.isLoginPage = true;
      this.isCheckRoute = true;
    } else if ((this.currentUser != null && this.currentUrl !== '/login') ||
                this.currentUrl === '/externalreferral' || this.currentUrl.startsWith('/externalreferral/extreferralConfirmation',0) || this.currentCookieUser !== 'NoCookie') {
                  this.staticData = localStorage.getItem('STATIC_DATA_MAP');
                  if(this.staticData) {
                    let returnUrl;
                    returnUrl = this.route.snapshot.queryParams.returnUrl;
                    if (returnUrl && this.isUrlChecked) {
                      this.isUrlChecked = false;
                      this.router.navigateByUrl(returnUrl);
                    }
                    this.isLoginPage = false;
                    this.isCheckRoute = false;
                  }
    }
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }
}

