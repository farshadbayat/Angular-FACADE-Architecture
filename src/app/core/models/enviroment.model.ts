export interface IEnvironment {
  baseEndpoint: string;
  loginRoute?: string;
  urlPathSchema: string;
  apiSignatureName?: string;
  apiVersion?: string;
  debug?: boolean;
  bearer?: string;
  encodeQueryParam?: boolean;
}

export class Environment implements IEnvironment {
  public baseEndpoint: string = '';
  public loginRoute?: string = '';
  public urlPathSchema: string =
    '{MODULE_NAME}/{API_SIGNATURE_NAME}/{API_VERSION}/{CONTROLLER_NAME}/{ACTION_NAME}';
  public apiSignatureName?: string = '';
  public apiVersion?: string = 'v1';
  public debug?: boolean = true;
  public bearer?: string = '';
  public encodeQueryParam?: boolean = true;
}
