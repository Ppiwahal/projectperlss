export class RefIntakeActionAppointment {
  constructor(
    public refId: string,
    public prsnId: number,
    public appStatusCd: number,
    public cancelRsnCd: string,
    public appDt: string,
    public cntctMethodCd: string,
    public addrLine1: string,
    public addrLine2: string,
    public city: string,
    public stateCd: string,
    public zip: string,
    public zipExtsn: string,
    public cnty: string,
   ) {  }
}
