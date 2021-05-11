export class AdjudicationSearch {
    constructor(
      public personId: string,
      public paeId: string,
      public assignedUserId: string,
      public submitDtFrom: any,
      public submitDtTo:any,
      public adjDueDt: string,
      public adjStatusCd: string,
      public queueNameCd: string,
      public taskStatusCd:string,
      public applicantAge: string,
      public acutyScrore: string,
     
      ) {  }
  }
  