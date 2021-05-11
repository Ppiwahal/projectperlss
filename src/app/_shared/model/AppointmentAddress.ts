export class AppointmentAddress {
    constructor(
      public addrLine1: string,
      public addrLine2: string,
      public appointment_id: string,
      public city: string,
      public cntyCd: string,
      public ext: string,
      public id: string,
      public stateCd: string,
      public zip: string) {  }
  }