import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../_shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeftnavComponent } from './leftnav.component';
import { RightnavModule } from '../rightnav/rightnav.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LeftnavComponent
  ],

  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    RightnavModule,
    SharedModule
  ]
})
export class LeftnavModule { }
