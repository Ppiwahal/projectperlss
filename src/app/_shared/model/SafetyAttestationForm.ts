export class SafetyAttestationForm {
  constructor(
    public qualifiedAssessorId: string,
    public qualifiedAssessorName: string,
    public credentialsCd: string,
    public doBelieveSw: string,
    public donotBelieveSw: string,
    public reqApplcntSw: string,
    public paeId: string,
    public createdBy: string,
    public createdDt: string,
    public reqPageId: string,
  ){}
}
