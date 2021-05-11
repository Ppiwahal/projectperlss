import { DiagnosisDocumentUpload } from './DiagnosisDocumentUpload';
export class PaeDiagnosisSummary  {
    constructor(
       public aplPdfTypeCd: string,
       public aplRequestId: string,
       public appPdfSw: string,
       public destinationCd: string,
       public documentId: string,
       public documentType: any,
       public documents: DiagnosisDocumentUpload [],
       public genDocumentId: string,
       public id: string,
       public paeId: string,
       public pageId: string,
       public prsnId: string,
       public refId: string,
    ) { }
}
