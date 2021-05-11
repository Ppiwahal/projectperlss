import { PAGE_BUSINESSID_MAPPINGS } from '../constants/pageMappings';
import * as Constants from '../constants/application.constants';
import * as CryptoJS from 'crypto-js';

export class PageAccessUtil {

  constructor() {
  }

  public static hasUserAccessToPage(businessFunctionId) {
      const pageAccessData = localStorage.getItem('PAGE_ACCESS_DATA');
      if (pageAccessData && businessFunctionId) {
        const decryptedPageAccessData =  CryptoJS.AES.decrypt(pageAccessData, Constants.APP_ENC_DECRYPT_KEY).toString(CryptoJS.enc.Utf8);
        const businessFunctions = JSON.parse(decryptedPageAccessData);
        const listOfAllPages = businessFunctions.listBusinessFunctions;
        if (listOfAllPages && listOfAllPages.length > 0) {
          const isPageAccessFound = listOfAllPages.findIndex(page => page.businessFunctionId === businessFunctionId && page.pageAccessLevel !== 'NA');
          return (isPageAccessFound > -1) ? true : false;
        }
        return true;
      }
      return true;
    }
  }
