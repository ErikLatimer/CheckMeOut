import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { AlertErrorComponent } from './alert-error/alert-error.component';


@NgModule({
  declarations: [
    LoadingComponent,
    AlertErrorComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoadingComponent,
    AlertErrorComponent,
  ]
})
export class LibModule { }
