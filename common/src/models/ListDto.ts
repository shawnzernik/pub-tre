export interface ListDto {
    guid: string;
    title: string;
    urlKey: string;
    topMenuGuid: string,
    leftMenuGuid: string;
    sql: string;
    editUrl?: string;
    deleteUrl?: string;
    autoload: boolean;
}