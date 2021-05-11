import {AppointmentAddress} from './AppointmentAddress';
export class AppointmentAddUpdate {
    constructor(
      public appointmentAddressVO?:AppointmentAddress,
      public applicantAddressVO?: AppointmentAddress,
      public appDt?: any,
      public appointmentStatusCd?: string,
      public appointmentTypeCd?: string,
      public appointmentId?: string,
      public cancelReasonCd?: string,
      public cancelReasonNotes?: string,
      public cancelReasonNotesCd?: string,
      public contactMethodCd?: string,
      public contactPersonSw?: string,
      public cellPhNum?: string,
      public homePhNum?: string,
      public workPhNum?: string,
      public id?: string,
      public paeId?: string,
      public personId?: string,
      public refId?: string,
      public reqPageId?: string) {  }
  } 