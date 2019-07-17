import { ScreenDimensionService } from './screen-dimensions.service';
import { PassRequest, RegisterRequest, TokenRegistry, YellowBook } from './../lib/TokenInterfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private screenDimensionService: ScreenDimensionService) {}
  private readonly INITIAL_TOKEN_BEARER_NAME: string = "qrscanner";
  private registry: TokenRegistry = {};
  private registryYellowBook: YellowBook = {};

  public registryCopy: TokenRegistry = {};

  registerTokenBearer(request: RegisterRequest) {
    console.log(`UUID:${request.tokenBearerUUID}`);
    console.log(`Name:${request.tokenBearerName}`);
    let uuid = request.tokenBearerUUID;
    let name = request.tokenBearerName;
    
    console.log(`TOKEN BEARER UUID:"${uuid}" NAME:"${name}" HAS SUCCESSFULLY REGISTERED`);
    if(name == this.INITIAL_TOKEN_BEARER_NAME) {this.registry[uuid] = true;}
    else {this.registry[uuid] = false;}
    this.updateRegistryCopy();
  }
  updateRegistryCopy() {this.registryCopy=this.registry;}
  passToken(request: PassRequest) {
    let uuid = request.tokenBearerUUID;
    let targetName = request.targetTokenBearerName;
    if (!(this.registry[uuid]) || (typeof this.registry[uuid] == "undefined")) {
      console.error("ERROR. CANNOT PERFORM A TOKEN PASS IF PROCLAIMED CURRENT TOKEN HOLDER DOES NOT HAVE TOKEN");
      return;
    }
    if (typeof this.registryYellowBook[targetName] == "undefined") {
      console.error("ERROR. CANNOT PERFORM A TOKEN PASS IF NAME IS NOT A TOKEN BEARER");
    }
    this.registry[uuid] = false;
    this.registry[this.registryYellowBook[targetName]] = true;
    this.updateRegistryCopy();
  }

  ngOnInit() {
    this.screenDimensionService.init();
    this.screenDimensionService._test();
   console.log(this.screenDimensionService.getInnerWindowHeight());
    if (typeof window.orientation == "undefined" ) {
    }
    else { document.getElementById("root").style.overflow = "scroll"; }
  }
  title = 'CheckMeOut';
}
