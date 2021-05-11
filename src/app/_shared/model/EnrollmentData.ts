export class EnrollmentData {
    constructor(
      public id: string,
      public enrId: string,
      public enrDenialRsnCd: string,
      public enrEndDt: string,
      public enrStartDt: string,
      public authStatusCd: string,
      public comments: string,
      public taskId: number
      ){}

}