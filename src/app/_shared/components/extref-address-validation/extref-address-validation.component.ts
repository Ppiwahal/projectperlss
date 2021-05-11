import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddressService } from '../../services/address.service';
import { ExtrefApplicantInformationComponent} from '../../../../app/external-referral/extref-applicant-information/extref-applicant-information.component';
@Component({
  selector: 'app-extref-address-validation',
  templateUrl: './extref-address-validation.component.html',
  styleUrls: ['./extref-address-validation.component.scss'],
})
export class ExtrefAddressValidationComponent implements OnInit, OnDestroy {

  subscriptions$ = [];
  dataSource = new MatTableDataSource();
  noAddress = false;
  addressFound = false;
  addressObj = {
    addrLine1: '',
    addrLine2: '',
    city: '',
    state: '',
    zipCode: '',
    ext: ''
  };

  constructor(public addressService: AddressService,
              public dialogRef: MatDialogRef<ExtrefApplicantInformationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const payload = {
      messageHeader: {
        referenceId: '456789',
        transactionId: '60083c66-fc2',
        originatorId: 'ws-teds',
        originalRequestor: 'N/A',
        dateTimestamp: '2002-05-30T09:00:00',
        transactionDate: '2002-05-30T09:00:00'
      },
      Country: 'USA',
      Engine: {
        Flatten: 'true',
        PromptSet: 'Default',
        Timeout: '300000',
        text: 'Verification'
      },
      Layout: 'Database Layout',
      Search: '',
      FormattedAddressInPicklist: 'true'
    };
    let searchAddress = '';
    if (this.data.addrLine1) {
      searchAddress = searchAddress + this.data.addrLine1 + ', ';
    }
    if (this.data.addrLine2) {
      searchAddress = searchAddress + this.data.addrLine2 + ', ';
    }
    if (this.data.city) {
      searchAddress = searchAddress + this.data.city + ', ';
    }
    if (this.data.state) {
      searchAddress = searchAddress + this.data.state + ', ';
    }
    if (this.data.zipCode) {
      searchAddress = searchAddress + this.data.zipCode;
    }
    payload.Search = searchAddress;
    this.validateAddress(payload);
  }

  validateAddress(payload) {
    const ValidateAddressSubscriptions = this.addressService.validateextrefAddress(payload).subscribe(response => {
      if (response && response.QASearchResult && response.QASearchResult.QAAddress && response.QASearchResult.QAAddress.AddressLine) {
        this.noAddress = false;
        const addressArray = response.QASearchResult.QAAddress.AddressLine;
        this.addressObj.addrLine1 = addressArray[0].Line;
        this.addressObj.addrLine2 = addressArray[1].Line;
        this.addressObj.city = addressArray[3].Line;
        this.addressObj.state = addressArray[4].Line;
        this.addressObj.zipCode = addressArray[5].Line.split('-')[0];
        this.addressObj.ext = addressArray[5].Line.split('-')[1];
        this.addressFound = true;
        console.log(this.addressObj);
      } else {
        this.noAddress = true;
        this.addressFound = false;
      }
    }, error => {
      this.noAddress = true;
      this.addressFound = false;
    });
    this.subscriptions$.push(ValidateAddressSubscriptions);
  }

  useThisAddress(address, value) {
    if (value === 'new') {
      this.dialogRef.close(address);
    } else {
      this.dialogRef.close();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subscriptions$ && this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription$ => subscription$.unsubscribe());
    }
  }

}
