import { PostGrestService } from './lib/post-grest.service';
import { ScreenDimensionService } from './lib/screen-dimension.service';
import { PassRequest, RegisterRequest, TokenRegistry, YellowBook } from './../lib/TokenInterfaces';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private screenDimensionService: ScreenDimensionService, private postgrestService: PostGrestService) {}
  private readonly INITIAL_TOKEN_BEARER_NAME: string = "qrscanner";
  private registry: TokenRegistry = {};
  private registryYellowBook: YellowBook = {};

  public registryCopy: TokenRegistry = {};

  private _nameRegistry: string[] = [];

  registerTokenBearer(request: RegisterRequest) {
    //! TO DO: 
    // Have a way to check if a token bearer has already registered to prevent errors
    console.log(`UUID:${request.tokenBearerUUID}`);
    console.log(`Name:${request.tokenBearerName}`);
    let uuid = request.tokenBearerUUID;
    let name = request.tokenBearerName;
    if (this._nameRegistry.includes(name)) { 
      console.error(`Token bearer with name "${name}" has already registered. Refusing to re-register token bearer...`);
      return;
    }
    else {this._nameRegistry.push(name);}
    console.log(`TOKEN BEARER UUID:"${uuid}" NAME:"${name}" HAS SUCCESSFULLY REGISTERED`);
    if(name == this.INITIAL_TOKEN_BEARER_NAME) {
      console.log(`Handing off the initial token to bearer "${name}"`);
      this.registry[uuid] = true;
    }
    else {this.registry[uuid] = false;}
    // Associate the tokenBearer name with it's uuid.
    this.registryYellowBook[name] = uuid;
    this.updateRegistryCopy();
  }
  updateRegistryCopy() {
    console.log("Updating registry copy...");
    this.registryCopy=this.registry;
    //this.changDetector.detectChanges();
  }
  passToken(request: PassRequest) {
    let uuid = request.tokenBearerUUID;
    console.log(`Token Bearer passing the token's UUID: "${uuid}"`);
    let targetName = request.targetTokenBearerName;
    console.log(`Target Name: "${targetName}"`);
    if (!(this.registry[uuid]) || (typeof this.registry[uuid] == "undefined")) {
      console.error("ERROR. CANNOT PERFORM A TOKEN PASS IF PROCLAIMED CURRENT TOKEN HOLDER DOES NOT HAVE TOKEN");
      return;
    }
    if (typeof this.registryYellowBook[targetName] == "undefined") {
      console.error("ERROR. CANNOT PERFORM A TOKEN PASS IF NAME IS NOT A TOKEN BEARER");
    }
    this.registry[uuid] = false;
    console.log(this.registryYellowBook[targetName]);
    this.registry[this.registryYellowBook[targetName]] = true;
    this.updateRegistryCopy();
  }

  ngOnInit() {
    this.screenDimensionService.init();
    this.screenDimensionService.listenToResize();
    this.screenDimensionService.listenToOrientationChange();
    if (typeof window.orientation == "undefined" ) {
    }
    else { document.getElementById("root").style.overflow = "scroll"; }
    this.postgrestService.init();
  }
  title = 'CheckMeOut';
}
