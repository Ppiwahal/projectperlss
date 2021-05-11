import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FooterComponent} from '../core/footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';
import {PhoneMaskDirective} from './phone-formatter.directive';

@NgModule({
  declarations: [FooterComponent, PhoneMaskDirective],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    FooterComponent, PhoneMaskDirective
  ]
})
export class SharedModule { }
