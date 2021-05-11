export class TransitionFilter {
    constructor(
      public personId: string,
      public transitionId: string,
      public transitionStatus: string,
      public transitionFrom: string,
      public transitionTo:string
     
      ) {  }
  }