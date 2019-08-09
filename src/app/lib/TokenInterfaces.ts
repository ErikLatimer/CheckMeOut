export interface TokenRegistry {
  [TokenBearerUUID: string]: boolean
}

export interface YellowBook {
  [TokenBearerName: string]: string
}

export interface PassRequest {
  tokenBearerUUID: string,
  targetTokenBearerName: string
}

export interface RegisterRequest {
  tokenBearerUUID: string,
  tokenBearerName: string
}

export abstract class TokenAdmin {
  private INITIAL_TOKEN_BEARER_NAME: string;
  private registry: TokenRegistry = {};
  private registryYellowBook: YellowBook = {};

  public registryCopy: TokenRegistry = {};

  registerTokenBearer(request: RegisterRequest) {
    //! TO DO: 
    // Have a way to check if a token bearer has already registered to prevent errors
    console.log(`UUID:${request.tokenBearerUUID}`);
    console.log(`Name:${request.tokenBearerName}`);
    let uuid = request.tokenBearerUUID;
    let name = request.tokenBearerName;
    
    console.log(`TOKEN BEARER UUID:"${uuid}" NAME:"${name}" HAS SUCCESSFULLY REGISTERED`);
    if(name == this.INITIAL_TOKEN_BEARER_NAME) {this.registry[uuid] = true;}
    else {this.registry[uuid] = false;}
    this.updateRegistryCopy();
  }
  setInitialTokenBearer(tokenBearerName: string): void {this.INITIAL_TOKEN_BEARER_NAME = tokenBearerName;}
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
}