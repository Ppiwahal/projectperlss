export class sectionTypeCdList {
    constructor(
        public sectionTypeCd: string,
        public rqstdEndDt: Date,
        public rqstdStartDt: Date,
        public frqcy12monSw: string,
        public frqcyCd: string,
        public serviceRequiredSw: string
    ) { }
}