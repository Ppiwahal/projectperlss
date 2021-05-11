import {Applicant} from './Applicant';
import {Pae} from './Pae';

export class PaeApplicant {
    constructor(
      public applicantVO: Applicant,
      public paeId: number,
      public paeVO: Pae,
      public refId: string,
      public reqPageId: string,
	  public taskId: number,
	  public userId: string,
      ) {  }
  }
