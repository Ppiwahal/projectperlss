import { ApplicantAddress } from './ApplicantAddress';
import { RefLivingArrangement } from './RefLivingArrangement';
import { RefContactAddress } from './RefContactAddress';

export class RefAppContact {
    constructor(
      public applicantCellPhNum:string,
      public applicantEmailAddr:string,
      public applicantHomePhNum:string,
      public appDsgnSw:string,
	  public appInterSw:string,
      public applicantWorkPhNum:string,
      public prefPhTypCd:string,
      public appPrefLangCd:string,
      public cellPhNum:string,
      public firstName:string,
      public mailSw:string,
      public lastName:string,
      public midInitial:string,
      public prefLangLettersCd:string,
      public refId:string,
      public reltshpCd:string,
      public suffix:string,
      public userTypeCd:string,
      public id:string,
      public reqPageId:string,    
      public refLivingArrangementVO: RefLivingArrangement,
      public refContactAddressVO: RefContactAddress
    ) { }
}
