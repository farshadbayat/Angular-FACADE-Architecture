export class Application {
    ApplicationGuid?: any;
    ApplicationName?: string;
    ApplicationTitle?: string;
    ApplicationStatus?:	ApplicationStatus;
    IconFileGuid?: any;
    Description?: string;
    CreateDate?: any;
}

export class Database {
    DatabaseID?: number;
    DatabaseName?: string;
    DatabaseUser?: string;
    DatabaseUrl?: string;
}

export class ApplicationDatabase {
    ApplicationDatabaseID?: number;
    ApplicationGuid?: any;
    DatabaseID?: number;
    IsArchive?: boolean;
    CreateDateTime?: Date;
}

export enum ApplicationStatus {
    Indeveloping = 0,
    Ready = 1,
    Running = 2,
    Delete = 3,
    Disable = 4,
}

