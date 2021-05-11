export class PaeSafetyDeterminationSummary {
  constructor(
      public reqPageId: string,
      public paeId: string,
      public reqSafetyConSw: string,
      public nfSrvcSw: string,
      public hcbsSrvcSw: string,
      public tenncareQualifiedAssesrSw: string

    ) {  }
}
