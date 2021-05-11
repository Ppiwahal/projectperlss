export class PaeContactInfoAddress{
  constructor(
    public reqPageId: number,
    public id: string,
    public paeId: string,
    public userTypeCd: string,
    public addrFormatCd: string,
    public addrTypeCd: string,
    public addrLine1: string,
    public addrLine2: string,
    public city: string,
    public stateCd: string,
    public zip: string,
    public zipExtn: string,
    public cntyCd: string,
    public mailAddrSw: string,
    public militaryPoCd: string,
    public militaryStateCd: string,
    public validatedAddressCd: string

  ) { }
}
