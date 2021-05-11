export class ReferralFilter {
  constructor(
    public personId: string,
    public grandRegion: string,
    public referralId: string,
    public referralReceivedDate: string,
    public referralStatus: string,
    public taskQueue: string,
    public taskStatus: string) {  }
}
