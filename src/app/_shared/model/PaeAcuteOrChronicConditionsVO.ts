export class PaeAcuteOrChronicConditionsVO {
  constructor(
    public paeId: string,
    public acuteChrncCd: string,
    public interventionReq: string,
    public licensedStaffReq: string,
    public medCndtn: string
  ) {  }
}
