export class RefContactAddress {
  constructor(
    public addrFormatCd: string,
      public addrLine1: string,
      public addrLine2: string,
      public refId: string,
      public city: string,
      public cntyCd: string,
      public militaryPoCd: string,
      public militaryStateCd: string,

      public prsnId: string,
      public reqPageId: string,
      public stateCd: string,
      public validatedAddressCd: string,
      public zipExtn: string,
      public zip: string) {  }
}
