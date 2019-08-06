import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainScreenModule } from './main-screen/main-screen.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CheckOutModule } from './check-out/check-out.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    CheckOutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
