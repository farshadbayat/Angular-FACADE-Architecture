export interface IResponse<T = any> {
  data?: T;
  messages?: string[];
  success: boolean;
}
