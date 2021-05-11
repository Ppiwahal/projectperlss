import { Component, OnInit, DoCheck } from '@angular/core';
import { RightnavToggleService } from '../_shared/services/rightnav-toggle.service';

@Component({
  selector: 'app-rightnav',
  templateUrl: './rightnav.component.html',
  styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent implements OnInit, DoCheck {

  rightnavFlag = false;
  rightnavData: any;
  data: any;
  componentType: any;
  isModalOpened = false;

  constructor(private rightnavToggleService: RightnavToggleService) {
    this.rightnavToggleService.getRightNavCompObs().subscribe(res => {
      if (res) {
        this.rightnavData = this.rightnavToggleService.getRightnavData();
        this.openModalDialog(res);
      }
    });
  }

  ngOnInit() { }

  ngDoCheck() {
    this.rightnavFlag = this.rightnavToggleService.getRightnavFlag();
    this.rightnavData = this.rightnavToggleService.getRightnavData();
    if (this.rightnavToggleService.getAppealSelectUploadFlag()) {
      this.openModalDialog('UPLOAD_DOC');
    }
  }

  handleDialogClosure() {
    document.getElementById('closeModalButton').click();
    this.isModalOpened = false;
  }

  openModalDialog(componentType) {
    document.getElementById('openModalButton').click();
    this.componentType = componentType;
    this.data = this.rightnavData;
    this.rightnavToggleService.setAppealSelectUploadFlag(false);
  }

}
