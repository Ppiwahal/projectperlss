import {ApplicantAddress} from './ApplicantAddress';

export class Applicant {
    constructor(
      public id: string,
      public prsnId: number,
      public aliasFirstName: string,
      public aliasLastName: string,
      public aliasMidInitial: string,
      public aliasSuffix: string,
      public aliasNameSw: string,
      public dobDt: string,
      public firstName: string,
      public genderCd: string,
      public lastName: string,
      public midInitial: string,
      public ssn: string,
      public ssnAvalSw: string,
      public suffix: string,
      public addIndivSW: boolean,
      public reqPageId: string,
      public fileClearanceSw: string,
      public newPersonSw: string,
	  public entityId: number,
	  public entityType: string,
      public addressVO: ApplicantAddress

      ) {  }
  }
