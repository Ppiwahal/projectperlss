export class RefSubmission {
    constructor(
        public id: string,
        public admissionDt: string,
        public email: string,
        public expeditedReviewSw: string,
        public othRelationshipCd: string,
        public phNum: string,
        public planTrnstnDt: string,
        public whoToCntctCd: string,
        public refCntctName: string,
        public refId: string,
        public relationshipCd: string,
        public signature: string,
        public whoIsSubmittingCd: string,
        public reqPageId: string
    ) { }

}
