export class AddOrUpdateMedicaidOnlyPayerDate {
    constructor(
        public chmTypeCd: string,
        public commentTxt: string,
        public enrollmentTypeCd: string,
        public entityCd: string,
        public paeId: string,
        public prsnId: string,
        public refId: string,
        public userId: string
    ) { }
}
