export class ApplicantAddress {
  constructor(
      public addrFormatCd: string,
      public addrLine1: string,
      public addrLine2: string,
     
      public city: string,
      public cntyCd: string,

      public mailAddrLine1: string,
      public mailAddrLine2: string,
      public mailAddressFormatCd: string,
      public mailAddrSw: string,
      public mailCity: string,
      public mailCounty: string,
      public mailState: string,
      public mailValidatedAddressCd: string,
      public mailZip: string,
      public mailZipExtn: string,

      public militaryPoCd: string,
      public militaryStateCd: string,

      public prsnId: string,
      public reqPageId: string,
      public stateCd: string,
      public validatedAddressCd: string,
      public zipExtn: string,
      public zip: string
    ) {  }
}
