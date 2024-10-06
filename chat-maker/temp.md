To update the code so that when a file is attached it is saved to `../temp`, complete the following code changes:

1. Implement the onChange for the `<input type="file" />`;

    ```tsx
    <Field label="Upload File"><input
        type="file"
        onChange={(e) => {
            this.setState({
                file: e.target.files?.item(0) || null
            });
        }}
    /></Field>
    ```

2. Implement the onClick for the `<Button label="Upload" />`;

    ```tsx
    <Button label="Upload" onClick={this.uploadClicked.bind(this)} />
    ```

    You will also need to add the function `uploadClicked`:

    ```ts
    private async uploadClicked() {
        try {
            await this.events.setLoading(true);

            if (!this.state.file)
                throw new Error("No file selected!");

            const token = await AuthService.getToken();
            await AiciService.upload(token, this.state.file);

            await this.events.setLoading(false);
        }
        catch (err) {
            ErrorMessage(this, err);
        }
    }
    ```

3. Implement a front end service handler to AiciService

    Add the following two functions to the `AiciService`:

    ```ts
    private static async readFile(f: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                resolve(ev.target.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(f);
        });
    }

    public static async upload(token: string, file: File): Promise<void> {
        const buff = await this.readFile(file);

        const uint8Array = new Uint8Array(buff);
        let binString = "";
        uint8Array.forEach((num) => {
            binString += String.fromCharCode(num);
        });
        const base64 = btoa(binString);

        const obj = {
            file: file.name,
            contents: base64
        };

        const ret = await FetchWrapper.post<AiciResponse>("/api/v0/aici/upload", obj, token);
    }
    ```

4. Implement a back end service to AiciService

    Implement the back end `AiciService`:

    ```ts
    export class AiciService extends BaseService {
        public constructor(app: express.Express) {
            super();

            console.log("AiciService.constructor()");

            app.post("/api/v0/aici/upload", (req, resp) => { this.methodWrapper(req, resp, this.postUpload) });
        }

        public async postUpload(req: express.Request, ds: EntitiesDataSource): Promise<void> {
            console.log("AiciService.postUpload()");
            await BaseService.checkSecurity("Aici:Upload", req, ds);

            await AiciLogic.upload(ds, req.body);
        }
    }
    ```



5. Implement a logic handler to AiciLogic

    Implement the back end `AiciLogic`:

    ```ts
    import { EntitiesDataSource } from "../data/EntitiesDataSource";
    import { Config } from "../Config";
    import path from "path";
    import fs from "fs"

    export interface AiciUpload {
        file: string;
        contents: string;
    }

    export class AiciLogic {
        static async upload(ds: EntitiesDataSource, body: AiciUpload): Promise<void> {
            const fileName = body.file;
            const contents = body.contents;
            if (!fileName || !contents)
                throw new Error("File and/or contents is empty!");

            const uploadedFile = path.join(Config.tempDirectory, fileName);
            const buffer = Buffer.from(contents, "base64");
            fs.writeFileSync(uploadedFile, buffer);
        }
    }
    ```

    We used a config option to specify the temp directory.

6. Update `Config`:

    ```ts
    import process from "process"

    export class Config {
        public static tempDirectory: string = process.env.TEMP_DIRECTORY || "../temp";
    }
    ```
