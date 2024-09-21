export interface ListDto {
    guid: string;
    title: string;
    urlKey: string;
    sql: string;
    listUrl: string;
    editUrl?: string;
    deleteUrl?: string;
    autoload: boolean;
}