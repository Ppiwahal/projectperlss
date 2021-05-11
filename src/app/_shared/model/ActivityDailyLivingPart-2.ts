import { ActivityBehavr } from './ActivityBehavrPart-2';
import { ActivityMedPart } from './ActivityMedpart-2';

export class ActivityDailyPartTwo {
    constructor(
      public applcntIncontSw: string,
      public behProblemCd: string,
      public cathOstWhithoutHelpCd: string,
      public catheterOstomySw: any,
      public communicateWantsCd: any,
      public eatWithoutHelpCd: string,
      public followInstructionsCd: string,
      public incontTypeCd: string,
      public incontWithoutHelpCd: string,
      public orientationPrsnPlaceCd: string,
      public paeActivitiesBehavrlDtlVO: ActivityBehavr[],
      public paeActivitiesMedicationDtlVO: ActivityMedPart[],
      public paeId: string,
      public reqPageId: string,
      public selfAdmMedicationCd: string,
      public toiletWithoutHelpCd: string,
      public trnsfrWithoutHelpCd: string,
      public walkWithoutHelpCd: string,
      public wheelChairCapableCd: string


      ) {  }
  }
