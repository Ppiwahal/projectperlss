export class NewFormDocument {
  constructor(
      public id: any,
      public formCd: string,
      public formDesc: string,
      public formDoc: string,
      public formEffBeginDt: string,
      public formEffEndDt: string,
      public formLocation: string,
      public formOperation: string,
      public userId: string
    ) {  }
}
