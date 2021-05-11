import { NumberFormatStyle } from "@angular/common";

export class RefIntakeActionExtension {
  constructor(
    public refId: string,
    public extsnRsnCd: string,
    public taskId: NumberFormatStyle
   ) {  }
}
