import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRScannerComponent } from './qrscanner/qrscanner.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CanvasDriverDirective } from './canvas-driver.directive';


@NgModule({
  declarations: [QRScannerComponent, CanvasDriverDirective],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  exports: [
    QRScannerComponent
  ]
})
export class CheckOutModule { }
