import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppMaterialModule} from '../_shared/app-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import { ExternalReferralRoutingModule } from './external-referral-routing.module';
import { ExternalReferralComponent } from './external-referral.component';
import { ExtrefApplicantInformationComponent } from './extref-applicant-information/extref-applicant-information.component';
import { ExtrefCareSupportComponent } from './extref-care-support/extref-care-support.component';
import { ExtrefContactInformationComponent } from './extref-contact-information/extref-contact-information.component';
import { ExtrefSchoolWorkComponent } from './extref-school-work/extref-school-work.component';
import { ExtrefStartComponent } from './extref-start/extref-start.component';
import { ExtrefSubmitComponent } from './extref-submit/extref-submit.component';
import { ExtrefStepperStartComponent } from './extref-stepper-start/extref-stepper-start.component';
import { ExtrefConfirmationComponent } from './extref-confirmation/extref-confirmation.component';
import { ExtrefPersonMatchComponent } from './extref-person-match/extref-person-match.component';
import { PhysicalAddressModule } from '../_shared/components/physical-address/physical-address.module';
import { NgxMaskModule } from 'ngx-mask';






@NgModule({
  declarations: [
    ExternalReferralComponent,
    ExtrefApplicantInformationComponent,
    ExtrefCareSupportComponent,
    ExtrefContactInformationComponent,
    ExtrefSchoolWorkComponent,
    ExtrefStartComponent,
    ExtrefSubmitComponent,
    ExtrefStepperStartComponent,
    ExtrefConfirmationComponent,
    ExtrefPersonMatchComponent
  ],
  imports: [
    CommonModule,
    ExternalReferralRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    PhysicalAddressModule,
    NgxMaskModule.forRoot()
  ]
})
export class ExternalReferralModule { }
