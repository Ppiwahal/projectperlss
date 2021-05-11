import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button/';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatOptionModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule} from '@angular/material/progress-bar'
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatProgressBarModule
  ],
  exports: [
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressBarModule
  ]
})
export class AppMaterialModule { }
