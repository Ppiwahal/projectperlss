import {RefApplicantDetail} from './RefApplicantDetail';
import {Applicant} from './Applicant';
export class RefCoreDtl {
    constructor(
      public reqPageId: string,
      public id: string,
      public refId: string,
      public documentId: string,
      public entityId: number,
      public entityType: string,
      public externalRefSw: string,
      public pdfGeneratedSw: string,
      public personId: string,
      public programCd: string,
      public referralTypeCd: string,
      public sourceCd: string,
      public startDt: string,
      public submissionDt: string,
      public refStatus: string,
      public refApplicantDetail: RefApplicantDetail,
      public applcantVO: Applicant
      ) {
       }
  }
