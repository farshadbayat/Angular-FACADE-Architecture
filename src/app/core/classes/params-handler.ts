import { Dictionary } from "./dictionary.type";

export class ParamsHandler {
    private params: Dictionary<any> = {};
    constructor(private init: object | null = null) {
        if (init !== null) {
           this.params = Object.assign( {} , init);
        }
    }

    public static eup(object: any): string {
      let url = '';
      url = JSON.stringify(object, (key, value) => {
        if (value !== null) {
          return value;
        }
      });
      return btoa(url);
    }

    public static dup<T>(url: string): T {
        return JSON.parse(atob(url));
    }

    public clear() {
        this.params = {};
    }

    public addParam(key: any, value: any): ParamsHandler {
        if ( value !== undefined && value !== null ) {
            this.params[key] = value;
        }
        return this;
    }

    public removeParam(key: any): ParamsHandler {
        if ( Object.keys(this.params).indexOf(key) !== -1 ) {
            delete this.params[key];
        }
        return this;
    }

    public getParams(): object {
        return this.params;
    }

    public count() {
        if ( this.params ) {
            const objPropName = Object.getOwnPropertyNames(this.params);
            return objPropName.length;
        } else {
            return 0;
        }
    }

    public toJson(): Dictionary<any> {
        return this.params;
    }

    public urlParamaters(ignoreNullParam = true): string {
        const objPropName = Object.getOwnPropertyNames(this.params);
        let objStr = '';
        for (const item of objPropName) {
            if ((ignoreNullParam === true && this.params[item] !== '' && this.params[item] !== null && this.params[item] !== undefined) ||
                (ignoreNullParam === false)) {
                objStr += item + '=' + encodeURIComponent(this.params[item]) + '&';
            }
        }
        return objStr.substring(0, objStr.length - 1);
    }

}
