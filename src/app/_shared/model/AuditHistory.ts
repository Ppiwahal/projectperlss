export class AuditHistory {
  constructor(
    public appealId: string,
    public referralId: string,
    public paeId: string,
    public userId: string,
    public personId: string,
    public pageId: string,
    public modifiedFromDate: any,
    public modifiedToDate: any) {  }
}
