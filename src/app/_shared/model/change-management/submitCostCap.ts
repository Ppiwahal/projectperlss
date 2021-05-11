export class SubmitCostCapException {
    constructor(
      public actionTypeCd: string,
      public chmTypeCd: string,
      public exceptionAmt: string,
      public exceptionEffDt: string,
      public exceptionRsn: string,
      public paeId: string,
      public prsnId: string,
      public userId: string,

      ) {  }
  }
