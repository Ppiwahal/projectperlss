export class RrefRequest {
    constructor(
      public id: string,
      public refId: string,
            public documentId: string,
           public externalRefSw: string,
            public pdfGeneratedSw: string,
           public  personId:string,
           public  startDt: string,
            public submissionDt: string,
           public  refStatus: string,
           public  referralTypeCd: string,
           public  entityCd: string,
            public sourceCd: string,
            public entityType: string,
            public programCd: string,
            public assignedUserId: string,
            public assignedEntity: string
      ) {  }
}
