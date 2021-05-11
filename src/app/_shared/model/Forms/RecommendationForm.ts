export class RecommendationForm {
  constructor(
    public id: string,
    public credentials: string,
    public electronicSignature: string,
    public notRcmdTrnstnlGrp7Sw: string,
    public notRcmdTrnstnlGrp8Sw: string,
    public rcmdDt: string,
    public rcmdTrnstnlGrp7Sw: string,
    public rcmdTrnstnlGrp8Sw: string,
    public rvwdIntsGrp7Sw: string,
    public rvwdIntsGrp8Sw: string,
    public intakeOutcomeId: string,

      ) { }
}