import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PhysicalAddressComponent } from './physical-address.component';
import { AppMaterialModule } from '../../app-material.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [PhysicalAddressComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppMaterialModule,
        NgxMaskModule.forRoot()
    ],
    exports: [PhysicalAddressComponent]
})
export class PhysicalAddressModule {}
