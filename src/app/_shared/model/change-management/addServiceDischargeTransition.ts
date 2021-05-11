export class AddServiceDischargeTransition {
    constructor(
      public actualDt: string,
      public adminTaskResponse: string,
      public chmId: string,
      public chmTypeCd: string,
      public paeId: string,
      public refId: string

      ) {  }
  }
