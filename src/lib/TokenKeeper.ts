import { string_boolean_dictionary } from './string_boolean_Dictionary';
import { TokenBearer } from './TokenBearer';

export class TokenKeeper {
  private tokenDictionary: string_boolean_dictionary;
  constructor(initialTokenBearer: TokenBearer, tokenCandidates: TokenBearer[]) {
    tokenCandidates.forEach((tokenBearer)=> {
      this.tokenDictionary[tokenBearer.uid] = false;
    });
    // Check for mismatched token bearers
    if (!(this.isTokenCandidate(initialTokenBearer))) {
      // Throw an error
      console.error("ERROR. INITIAL TOKEN BEARER NOT INCLUDED WITHIN TOKEN CANDIDATES. RESETTING AND EXITING...");
      // Resets the token dictionary blank
      this.tokenDictionary = {};
      return;
    }
    else {
      this.tokenDictionary[initialTokenBearer.uid] = true;
    }
  }

  public passToken(newTokenBearer: TokenBearer, currentTokenBearer: TokenBearer): void {
    // Check to see if the token bearer claiming to pass the token actually HAS the token to pass
    if(!(this.hasToken(currentTokenBearer))) {
      console.error("ERROR. CANNOT PERFORM A TOKEN PASS IF PROCLAIMED CURRENT TOKEN HOLDER DOES NOT HAVE TOKEN");
      return;
    }
    // Now check to see if the token bearer the token is being passed to CAN EVEN RECEIVE the token
    if (!(this.isTokenCandidate(newTokenBearer))) {
      console.error("ERROR. CANNOT PERFORM A TOKEN PASS IF THE RECEIVER OF THE TOKEN IS NOT A CANDIDATE");
      return;
    }
    this.tokenDictionary[currentTokenBearer.uid] = false;
    this.tokenDictionary[newTokenBearer.uid] = true;
  }

  public tokenCarrier(): string {
    Object.keys(this.tokenDictionary).forEach((uid)=> {
      if(this.tokenDictionary[uid]) {
        return uid;
      }
    });
    throw new Error("ERROR. NO TOKEN CANDIDATE CURRENTLY CARRIES TOKEN.");
  }

  public hasToken(tokenBearer: TokenBearer): boolean {
    // If the Token Bearer were checking for isn't even a candidate...
    if (!(this.isTokenCandidate(tokenBearer))) {
      console.warn(`Performed hasToken() on Token Bearer ${tokenBearer.uid}, who isn't even a Token Candidate`);
      return false;
    }
    return this.tokenDictionary[tokenBearer.uid];
  }

  private isTokenCandidate(tokenBearer: TokenBearer): boolean {
    // Because the TokenDictionary only contains a TokenBearer's string uid and an associated boolean, Object.keys() should work fine here
    Object.keys(this.tokenDictionary).forEach((uid)=> {
      if(tokenBearer.uid == uid) {
        return true;
      }
    });
    return false;
  }
}