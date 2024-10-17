export interface UploadDto {
    /** The name of the file being uploaded. */
    file: string;
    /** The base64-encoded contents of the file. */
    contents: string;
}