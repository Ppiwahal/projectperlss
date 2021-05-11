import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { PAGE_BUSINESSID_MAPPINGS } from '../../_shared/constants/pageMappings';
import * as Constants from '../../_shared/constants/application.constants';
import * as CryptoJS from 'crypto-js';

const PAGE_MAPPINGS = PAGE_BUSINESSID_MAPPINGS;
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    const matchedPagedMapping = PAGE_MAPPINGS.filter(mapping => mapping.path === state.url);
    const pageAccessData = localStorage.getItem('PAGE_ACCESS_DATA');
    if(matchedPagedMapping && matchedPagedMapping.length > 0) {
     if(pageAccessData) {
        const decryptedPageAccessData =  CryptoJS.AES.decrypt(pageAccessData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
        const businessFunctions = JSON.parse(decryptedPageAccessData).listBusinessFunctions;
        const matchedBusinessFunc = businessFunctions.filter(business =>
          business.businessFunctionId === matchedPagedMapping[0].businessFunctionId);
        const pageAccess =  matchedBusinessFunc && matchedBusinessFunc.length > 0 ? matchedBusinessFunc[0].businessFAccessLvlCd : '';
        const readOnly = (pageAccess === 'R') ? true: false;
        this.authenticationService.setCurrentPageReadOnly(readOnly);
      }
    }
    if (currentUser && pageAccessData) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
