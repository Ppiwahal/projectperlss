import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdjudicationDetailsService } from 'src/app/core/services/adjudication/adjudication-details.service';
import * as validation from 'src/app/_shared/constants/validation.constants';
@Component({
  selector: 'app-adjudication-denial-popup',
  templateUrl: './adjudication-denial-popup.component.html',
  styleUrls: ['./adjudication-denial-popup.component.scss']
})
export class AdjudicationDenialPopupComponent implements OnInit {
  reasons = [];
  otherText = null;
  validationMessage = "";
  adjId = "";
  rsnTypeCd = "";
  currentClarificationReasons = null;
  denialReasons: any;
  constructor(public dialogRef: MatDialogRef<AdjudicationDenialPopupComponent>,
    private toastr: ToastrService,
    private adjudicationDetailsService: AdjudicationDetailsService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    if (this.data) {
      this.reasons = this.data.denialReasons;
      this.adjId = this.data.adjId;
      // this.adjudicationDetailsService.getAdjPopupDetail(this.data.key).subscribe(result => {
      //   console.log('newfork', result)
      //   this.reasons = result;
      //   this.adjudicationDetailsService.getAdjAdjClrRsnByAdId(this.adjId).subscribe(value => {
      //     this.currentClarificationReasons = value;
      //     const rsnCode = value.adjClrfcnRsnCdVOs.filter(res => res.rsnFlagSw === "Y").map(res => res.rsnCd);
      //     console.log(rsnCode);
      //     this.reasons.map(re => re.isChecked = rsnCode.includes(re.code))
      //   });
      // })
    }
  }

  onCheckBoxSelect(value, item) {
    item.isChecked = value;
    // this.toastr.error("Sample Test")

  }

  isValid() {
    // this.validationMessage = '';
    // if (this.reasons.find(res => res.code === "OTH" && res.isChecked)) {
    //   if (!this.otherText) {
    //     this.validationMessage = validation.A1;
    //   } else if (this.otherText.includes("~")) {
    //     this.validationMessage = validation.A2;
    //   }
    // }
    // return !this.validationMessage && this.reasons.findIndex(res => res.isChecked) > -1;
    return true;
  }
  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    const payload = {
      adjId: this.adjId,
      rsnTypeCd: this.rsnTypeCd ? this.rsnTypeCd : "DN",
      clrfcnCommentTxt: this.otherText,
      adjClrfcnRsnCdVOs: this.reasons.filter(res => res.isChecked).map(res => (
        { rsnCd: res.code, rsnFlagSw: "Y" }
      ))
      //  [
      //   {
      //     "rsnCd": "DIQ",
      //     "rsnFlagSw": "Y"
      //   },
      //   {
      //     "rsnCd": "FAC",
      //     "rsnFlagSw": "Y"
      //   },
      //   {
      //     "rsnCd": "NUR",
      //     "rsnFlagSw": "Y"
      //   },
      //   {
      //     "rsnCd": "DID",
      //     "rsnFlagSw": "Y"
      //   }
      // ]
    }

    this.adjudicationDetailsService.submitAdjPopupData(payload).subscribe(re => {
      console.log(re)
      // this.closeDialog();
    })
    this.closeDialog();
  }

}
