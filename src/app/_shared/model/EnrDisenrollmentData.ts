export class EnrDisenrollmentData {
    constructor(
      public id: string,
      public enrId: string,
      public authDt: string,
      public authUserId: string,
      public disEnrDt: string,
      public disEnrRsnCd: string,
      public ltssDscnCd: string,
      public disEnrTypeCd: string
      ){}

}