export class PaeRecertificationVO {
    constructor(
        public reqPageId: string,
        public paeId: string,
        public ackSw: string,
        public enrGrpCd: string,
        public recrtfctnDcsnCd: string,
        public recrtfctnDueDt: string,
        public trnstnExpctdSw: string,

    ) { }
}
