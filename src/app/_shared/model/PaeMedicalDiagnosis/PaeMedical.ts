import { MedicalDiagnosisCDList } from './PaeMedDiagnosisList';
import { MedDocument } from './MedDocument';
export class PaeMedical {
    constructor(
        public reqPageId: string,
        public paeId: string,
        public intlctulDisSw: string,
        public psycEvalSw: string,
        public iqTestScore: string,
        public iqTestDt: Date,
        public iqTestTypeDesc: string,
        public chrncDiagnsSw: string,
        public trgtPopDiagnsCd: string,
        public docDtlsDesc: string,
        public lvlIntelDisabilityCd: string,
        public personId: string,
        public medicalDiagnosisCdList: MedicalDiagnosisCDList [] ,
        public medDocumentCd: any[]
    ) { }
}
