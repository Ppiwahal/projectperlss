export class RefEnterIntakeOutcome {
  constructor(
    public refId: string,
    public visitCompleteSw: string,
    public rsnCd: string,
    public typeOfCntctCd: string,
    public intakeVisitComptdDt: string,
    public refIntakeIncompleteVOList: any[],
    public userTypeCd: string,
    public intakeOutcomeId: number) {  }
}
