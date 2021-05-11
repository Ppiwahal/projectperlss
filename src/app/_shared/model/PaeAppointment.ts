
export interface PaeAppointment {
  addrLine1: string,
  addrLine2: string,
  city: string,
  countyCd: string,
  extsn: string,
  id: number,
  stateCd: string,
  zip: string,
  appDt: string,
  appTypeCd: string,
  cancelRsnCd: string,
  cntctPrsnSw: string,
  cntctMethodCd: string,
  locOrNumber: string,
  paeId: string,
  prsnId: number,
  reqPageId: string,
  appGroupCd: string,
  telephoneNum: string,

  appStatusCd: string;
  auditDt: string;
  updateUserId: string;
  contactUser: string;
  //making optional for UI need to test with rhe backend team 
  typeOfContact?: string;
  updateDt?: string;
  cancelRsnNotes?: string;
  createDt?: string;
  createUserId?: string;
  documentId?: string;
}
