export class WithdrawEnrollment {
    constructor(
        public chmTypeCd: string,
        public commentTxt: string,
        public reqPageId: string,
        public withdrawRsnCd: string
    ) { }
}
