export class PaeEnhancedRespiratory {
  constructor(
  public chrncReqEndDt: string,
  public chrncReqStartDt: string,
  public chrncVentilatorSw: string,
  public trachealReqEndDt: string,
  public trachealReqStartDt: string,
  public trachealSuctionSw: string,
  public paeId: string,
  public reqPageId: string
    ) {
     }
}
