export interface Response<T = any> {
  data?: T;
  messages: string[];
  success: boolean;
}
