import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { QRScannerComponent } from './qrscanner/qrscanner.component';
import { LibModule } from './../lib/lib.module';
import { CheckOutFormComponent } from './check-out-form/check-out-form.component';

@NgModule({
  declarations: [QRScannerComponent, CheckOutFormComponent],
  imports: [
    CommonModule,
    LibModule,
    ButtonsModule,
    WavesModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  exports: [
    QRScannerComponent,
    CheckOutFormComponent
  ]
})
export class CheckOutModule {
  // schemas: [ NO_ERRORS_SCHEMA ],
 }
