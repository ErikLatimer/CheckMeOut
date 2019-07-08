import { TokenBearer } from './../lib/TokenBearer';
import { TokenKeeper } from '../lib/TokenKeeper';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class TokenService {
  private static tokenKeeper: TokenKeeper;
  public static initialize(startingCarrier: TokenBearer, ableBearers: TokenBearer[]): void {
    this.tokenKeeper = new TokenKeeper(startingCarrier, ableBearers);
  }
  public static passToken(targetBearer: TokenBearer, carrier: TokenBearer): void {this.tokenKeeper.passToken(targetBearer, carrier);}
  public static hasToken(tokenBearer: TokenBearer): boolean {return this.tokenKeeper.hasToken(tokenBearer);}
  constructor() { }
}
