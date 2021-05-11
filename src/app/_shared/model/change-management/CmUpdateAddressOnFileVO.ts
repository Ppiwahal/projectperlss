import {UpdateAddress} from './addressFile';
export class CmUpdateAddressOnFileVO {
    constructor(
        
      public  id:number,

      public  paeId:string,
    
      public  prsnId:number,
    
      public  prefPhTypeCd:string,
    
      public  prefLangLettersCd:string,
    
      public  appInterSw:string,
      
      public  interprtLang:string,
    
      public  firstName:string,
    
      public  midInitial:string,
    
      public  lastName:string,
    
      public  emailAddr:string,
    
      public  cellPhNum:string,
    
      public  homePhNum:string,
    
      public  workPhNum:string,
    
      public  reltshpCd:string,
      
      public  mailSw:string,
    
      public  getLettersSw:string,
      
      public  userTypeCd:string,
    
      public  hasLegalRightsSw:string,
      
      public  contactSw:string,
    
      public  suffix:string,
    
      public  appDsgnSw:string,
      public addressVO:UpdateAddress
    
      

      ) {  }
  }
  