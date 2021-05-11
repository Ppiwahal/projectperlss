export class PaeSubmissionVO {
    constructor(
        public ceaDeterminationCd: string,
        public ceaSw: string,
        public certificateDt: string,
        public comments: string,
        public paeId: string,
        public paeRecrtfctnAckSw: string,
        public paeRecrtfctnSw: string,
        public reqPageId: string,
        public revisedPaeSw: string,
        public signature: string,
        public submitDt: string,
        public whoSubmittingCd: string

    ) { }
}
