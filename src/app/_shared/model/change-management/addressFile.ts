export class UpdateAddress {
    constructor(
        public addrFormatCd: string,
        public addrLine1: string,
        public addrLine2: string,
        public addrTypeCd: string,
        public city: string,
        public cntyCd: string,
        public id:number,
        public mailAddrLine1: string,
        public mailAddrLine2: string,
        public mailAddrSw: string,
        public mailAddressFormatCd: string,
        public mailCity: string,
        public mailCounty: string,
        public mailMilitaryPoCd: string,
        public mailMilitaryStateCd: string,
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
        public zip: string,
        public zipExtn: string,
        public paeId: string
      ) {  }
  }
  