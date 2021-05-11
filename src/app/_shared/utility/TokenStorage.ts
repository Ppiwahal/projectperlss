import { Injectable } from '@angular/core';
import { APP_STORAGE_TOKEN, APP_STORAGE_FIRSTNAME, APP_STORAGE_USERNAME } from '../constants/application.constants';




@Injectable()
export class TokenStorage {
  ServerConstants: any;

  constructor(){}

  public clearSession() {
    window.localStorage.removeItem(APP_STORAGE_TOKEN);
    window.localStorage.removeItem(APP_STORAGE_FIRSTNAME);
    window.sessionStorage.clear();
  }

  public saveSession(data: any) {
    window.localStorage.removeItem(APP_STORAGE_TOKEN);
    window.localStorage.setItem(APP_STORAGE_TOKEN, data.token);
    window.localStorage.setItem(APP_STORAGE_USERNAME, data.userName);
    window.localStorage.setItem(APP_STORAGE_FIRSTNAME, data.firstName);
  }

  public getToken(): string {
    return window.localStorage.getItem(APP_STORAGE_TOKEN);
  }
}
