export class PaeMedicalDiagnosis {
    constructor(

        public reqPageId: 1,
        public paeId: 'PAE1000080',
        public intellectualDisabilitySw: string,
        public physEvalSw: string,
        public iqTestScore: 60,
        public iqTestDt: '2020-10 - 07',
        public iqTestDesc: string,
        public chronicDiagnosisSw: string,
        public targetPopDiagnosisCd: 'O',
        public docDetailsDesc: string,
        public levelIntelDisabilityCd: string,
        public personId: 8000001,
        // tslint:disable-next-line: align
        /* public medicalDiagnosisCdList: string,
        public otherMedicalDiagnosis: string,
        public persist6MonthsSw: string,
        public expected12MonthsSw: string,
        public primaryDiagnosisSw: string,
        public medicalDiagnosisCd: string, */

        public otherMedicalDiagnosis: string,
        public persist6MonthsSw: string,
        public expected12MonthsSw: string,
        public primaryDiagnosisSw: string,
        public medicalDiagnosisCd: string,

        public medDocumentCd: string,



    ) { }
}
