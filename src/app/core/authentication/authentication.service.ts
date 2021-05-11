import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { TokenStorage } from '../../_shared/utility/TokenStorage';
import { Router } from '@angular/router';
import { EnvService } from '../../_shared/utility/env.service';
import { CookieService } from 'ng2-cookies';
import { StaticDataMapService } from '../helpers/static.data.map.service';
import * as CryptoJS from 'crypto-js';
import * as Constants from '../../_shared/constants/application.constants';
import { IdleTimeoutService } from 'src/app/login/idle-timeout/idle-timeout.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentCookieUser: BehaviorSubject<any>;
  public isLogout: BehaviorSubject<any>;
  public serverApiUrl: any;
  public staticData: any;
  public readOnly: any;
  userId: any;
  intervalId: any;
  headers: HttpHeaders = new HttpHeaders();
  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    public cookieService: CookieService,
    private router: Router,
    private envService: EnvService,
    private staticDataService: StaticDataMapService,
    private idleService: IdleTimeoutService,
    private toastr: ToastrService,) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('APP_STORAGE_TOKEN')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.serverApiUrl = this.envService.apiUrl();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  callIdleSession() {
    let createPayload = {
      "tokenId": this.getCookieByEnv(),
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.idleService.getSessionInfo(createPayload).subscribe((res: any) => {
        if (res.username && res.username != "") {
          this.idleService.idleTimeout(createPayload).subscribe((res: any) => {
          })
        }
      }
        , (error) => {
          console.log(error);
          clearInterval(this.intervalId);
          this.logout();
        })

    }, 180000);
  }

  login(username: string, password: string) {
    const urlParams = new URLSearchParams(window.location.search);
    let entityId;
    if (this.userId) {
      if (urlParams.get('returnUrl')) {
        if (urlParams.get('returnUrl').includes('entityId')) {
          entityId = urlParams.get('returnUrl').split('?')[1].split('=')[1];
        }
      } else if (urlParams.get('entityId')) {
        entityId = urlParams.get('entityId');
      }
    }
    return this.http.post<any>(this.serverApiUrl.API_URL + `/token/generate-token`,
      { username, password, entityId }, { observe: 'response' })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('APP_STORAGE_TOKEN', JSON.stringify(user.body));


        sessionStorage.setItem('SESSION_ID', user.headers.get('JSESSIONID'));
        this.currentUserSubject.next(user.body);
        console.log(user.headers.get('JSESSIONID'));
        this.currentCookieUser = new BehaviorSubject<any>(this.userId);
        const observables = [];
        const keys = [];
        const pageAccessData = localStorage.getItem('PAGE_ACCESS_DATA');
        if (user.body && user.body.entityId && user.body.userName && !pageAccessData) {
          keys.push('PAGE_ACCESS_DATA');
          observables.push(this.http.get(this.serverApiUrl.ADMIN_API_URL + `/getSecurityMatrix?userId=${user.body.userName}&entityId=${user.body.entityId}`));
        }
        // IAM Service
        if (this.getCookieByEnv() !== '') {
          this.callIdleSession();
        }
        const timeTravelData = localStorage.getItem('TIME_TRAVEL_DATA');
        if(!timeTravelData) {
          keys.push('TIME_TRAVEL_DATA');
          observables.push(this.http.get(this.serverApiUrl.API_URL + `/api/staticData/getCurrentDate`));

        }
        // retrieve static data
        this.staticData = localStorage.getItem('STATIC_DATA_MAP');
        if(!this.staticData) {
          keys.push('STATIC_DATA_MAP');
          observables.push(this.staticDataService.getStaticData());
        }
        if ((!this.staticData || !pageAccessData || !timeTravelData) && observables.length > 0) {
          forkJoin(observables).subscribe(res => {

            if (res && res.length > 0) {
                keys.forEach((key, index) => {
                    if(key === 'STATIC_DATA_MAP') {
                localStorage.setItem(key, JSON.stringify(res[index]));
              } else {
               localStorage.setItem(key, CryptoJS.AES.encrypt(JSON.stringify(res[index]), Constants.APP_ENC_DECRYPT_KEY).toString());

              }
            })
            }
            this.currentUserSubject.next(user.body);
            return user.body;
          });
        } else {
          this.currentUserSubject.next(user.body);
          return user.body;
        }

      }));
  }

  logout() {

    // remove user from local storage to log user out
    this.http.post<any>(this.serverApiUrl.API_URL + `/token/logout`, sessionStorage.getItem('SESSION_ID')).subscribe(data => {
      console.log(data);
    });
    this.currentCookieUser.next(null);
    localStorage.removeItem('APP_STORAGE_TOKEN');
    sessionStorage.removeItem('SESSION_ID');
    this.currentUserSubject.next(null);
    if (this.userId) {
      this.logoutSession();
    } else {
      this.isLogout = new BehaviorSubject<any>(true);
      this.router.navigate(['/login']);
    }
  }

  userValidate(skip, fileUpload = false) {
    const tcamCookie = this.getCookieByEnv();
    if (tcamCookie !== undefined && tcamCookie !== null) {
      this.validationSession(tcamCookie, skip, fileUpload).subscribe((sessData) => {
        if (sessData !== undefined && sessData.valid) {
          if (sessData.uid !== undefined && sessData.uid !== '' && sessData.uid !== null) {
            this.userId = sessData.uid;
            if (this.userId !== undefined && this.userId !== null && this.userId !== '') {
              this.login(this.userId, 'password').subscribe(response => {
              });
              // this.currentUserSubject.next(this.userId);
              return this.userId;
              // sessionStorage.setItem('userName', this.userId);
              // this.userAuthenticate();
            }
          } else {
            this.currentCookieUser = new BehaviorSubject<any>('NoCookie');
            // this.logoutUrl();
            return;
          }
        } else {
          this.currentCookieUser = new BehaviorSubject<any>('NoCookie');
          // this.logoutUrl();
          return;
        }
      }, error => {
        this.currentCookieUser = new BehaviorSubject<any>('NoCookie');
        console.log(error);
        // this.logoutUrl();
        return;
      });
    } else {
      this.currentCookieUser = new BehaviorSubject<any>('NoCookie');
      // this.logoutUrl();
      return;
    }
  }

  validationSession(cookie, skip, fileUpload = false) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('Access-Control-Allow-Methods', '*');
    if (skip) {
      headers = headers.append('skip', 'true');
    }
    if (fileUpload) {
      headers = headers.append('fileUpload', 'true');
    }
    return this.http.post<any>(this.serverApiUrl.ADMIN_API_URL + '/api/accounts/validate',
      { tokenId: cookie, loggedUserId: this.userId, pageId: null },
      { headers }).pipe(
        map(
          userData => {
            if (userData.uid !== undefined && userData.uid !== '' && userData.uid !== null) {
              sessionStorage.setItem('userName', userData.uid);
            } else {
              // this.logoutUrl();
              console.log('/api/validateSession/validate  ----- user data not available');
              return;
            }
            return userData;
          }
        )
      );
  }

  getCookieByEnv() {
    const allCookies = this.getAllCookies();
    const environment = this.serverApiUrl.ENVIRONMENT;
    let cookieName;
    if (environment === 'SIT' || environment === 'STC' || environment === 'STT') {
      cookieName = allCookies.TCAM_SIT;
    } else if (environment === 'STG') {
      cookieName = allCookies.TCAM_STG;
    } else if (environment === 'PPRD') {
      cookieName = allCookies.TCAM_PPRD;
    } else {
      cookieName = allCookies.TCAM;
    }
    let tcamCookie = '';
    if (cookieName) {
      tcamCookie = cookieName;
    } else {
      tcamCookie = '';
    }
    return tcamCookie;
  }

  getAllCookies() {
    return this.cookieService.getAll();
  }

  setCurrentPageReadOnly(readOnly) {
    this.readOnly = readOnly;
  }

  isCurrentPageReadOnly() {
    return this.readOnly;
  }

  logoutUrl() {
    window.location.href = this.serverApiUrl.TCAM_LOGOUT_URL;
    return;
  }

  refreshIdleTime() {
    const tcamCookie = this.getCookieByEnv();
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers = this.headers.append('Access-Control-Allow-Methods', '*');
    return this.http.post<any>(this.envService.apiUrl().apiUrl + '/api/validateSession/idleTimeRefresh',
      {
        tokenId: tcamCookie,
        loggedUserId: this.userId
      }, { headers: this.headers }).pipe(
        map(
          userData => {
            return userData;
          }
        )
      );
  }

  logoutSession() {
    sessionStorage.clear();
    this.logoutUrl();
    return;
  }

}
