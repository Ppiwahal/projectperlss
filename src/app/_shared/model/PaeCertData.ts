export class PaeCertData {
    constructor(
        public certifierOfAccuracy: string,
        public credentialsCd: string,
        public id: number,
        public paeCrtfctnDt: Date,
        public paeId: string,
        public qualifiedAssessorDtl: string,
        public qualifiedAssessorName: string,
        public reqPageId: string
    ) { }
}
