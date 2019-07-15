import { string_boolean_dictionary } from './string_boolean_Dictionary';
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