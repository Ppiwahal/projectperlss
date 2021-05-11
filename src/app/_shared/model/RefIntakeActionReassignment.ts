export class RefIntakeActionReassignment {
  constructor(
    public refId: string,
    public reassmntRsnTxt: string,
    public assignedEntityCd: string,
    public ltssRsnTxt: string,
    public taskId: number,
    public taskMasterId: number
   ) {  }
}
