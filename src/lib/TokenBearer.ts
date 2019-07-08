export interface TokenBearer {
  eventTokenPass(): void;
  hasToken: boolean;
  uid: string;
}