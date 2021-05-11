export interface PaeAppointmentSearch {
  reqPageId: number;
  id: number;
  addrLine1: string;
  addrLine2: string;
  appointmentDt: string;
  appoinementStatus: string;
  auditDt: string;
  city: string;
  contactMethodCd: string;
  contactPersonSw: string;
  contactUser: string;
  createDt: string;
  createUserId: number;
  documentId: number;
  ext: string;
  locOrNumber: string;
  personId: number;
  typeOfContact: string;
  updateDt: string;
  updateUserId: number;
  paeId: string;
  zip: string;
  county: string;
  state: string
}