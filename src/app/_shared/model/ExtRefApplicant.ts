import {ApplicantAddress} from './ApplicantAddress';

export class ExtRefApplicant {
    constructor(
      public id: string,
      public personId: string,
      public aliasFirstName: string,
      public aliasLastName: string,
      public aliasMidInitial: string,
      public aliasSuffix: string,
      public altNameSw: string,
      public dobDt: string,
    //   public designeeFirstName: string,
    //   public designeeInterSw: string,
    //   public designeeLastName: string,
    //   public designeeMidName: string,
    //   public designeeRelCd: string,
    //   public designeeSw: string,
    //   public diffContactDetSw: string,
    //   public documentId: string,
    //   public fileClearanceSw: string,
    //   public hasLegalRightsSw: string,
    //   public inactiveInd: string,
    //   public interpreterLang: string,
      public firstName: string,
      public genderCd: string,
      public lastName: string,
      public midInitial: string,
      public ssn: string,
      public ssnAvailableSw: string,
      public suffix: string,
      public addIndivSW: boolean,
      public reqPageId: string,
      public addressVO: ApplicantAddress

      ) {  }
  }
