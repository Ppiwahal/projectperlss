import { ContactUsService } from './../../services/widgets/contact-us.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-contact',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactInformation: any;

  constructor(private matDialogRef: MatDialogRef<ContactComponent>,
              private contactUsService: ContactUsService) { }

  ngOnInit(): void {
    const response = this.contactUsService.getContactUsDetails();
    response.then(data => {
      console.log(data.body);
      this.contactInformation = data.body;
    });
  }

  closePopup() {
    this.matDialogRef.close();
  }
  
}
