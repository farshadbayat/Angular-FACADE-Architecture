export interface Response<T = any> {
  Data?: T;
  Messages: string[];
  Success: boolean;
}
