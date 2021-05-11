export class PaeFallHistoryVOList {
  constructor(
    public fallAdditionalFactor: string,
    public fallDt: Date,
    public fallFactorEnvSw: string,
    public fallFactorImpVisSw: string,
    public fallFactorLowBldSw: string,
    public fallFactorMedSw: string,
    public fallTimeCd: string,
    public injuriesDesc: string,
    public injurySustainSw: string,
    public locationOfFall: string,
    public paeId: string,
    public preventMchnsmDesc: string,
    public preventMchnsmUnsucsflDesc: string
  ) {  }
}
