export class PaeAction {
  constructor(
    public endDt: string,
    public entityId: number,
    public entityType: string,
    public paeActionCd: string,
    public startDt: string,
    public userId: string,
    public paeId: string,
	public refId: string,
	public taskId: number
    ) {  }
}
