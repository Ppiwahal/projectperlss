export class PaeLivingArrangement {
  constructor(
      public addrLine1: string,
      public addrLine2: string,
     
      public admissionDt: string,
      public anticipatedDischargeDt: string,
      public anticipatedReleaseDt: string,

      public city: string,
      public cntyCd: string,
      public currLvngArrngCd: string,
      public expctdDischargeCd: string,
      public ext: number,
      public incarcerationDt: string,
      public intlctulDisableSw: string,
      public longTermCareSw: string,
      public lvngArngDesc: string,

      public mentalHlthSw: string,
      public noneSw: string,

      public nursingFacilityNameCd: string,
      public paeId: string,
      public phNumber: string,
      public phychiatricHospitalSw: string,
      public phyclDisableSw: string,
      public reqPageId: string,
      public schoolOutsideSw: string,
      public specialSchoolSw: string,
      public stateCd: string,
      public zip: string
    ) {  }
}
