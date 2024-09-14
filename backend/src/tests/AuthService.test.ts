import { ChildProcess, fork, spawn } from "child_process";

describe("AuthService", () => {
    let webProcess: ChildProcess;
    let webProcessReady: boolean = false;
    let webProcessWait = 2000;
    let webProcessRetires = 3;

    beforeAll(async () => {
        const onOutOrError = (data: string) => {
            console.log(data)
            if (data.includes("Server listening on port")) 
                webProcessReady = true;
        };
        
        webProcess = spawn("npx tsc && node ./dist/index.js");
        webProcess.stdout!.on("data", onOutOrError);
        webProcess.stderr!.on("data", onOutOrError);

        return new Promise<void>((resolve, reject) => {
            let retries = 0;
            const timeoutCallback = () => {
                if (webProcessReady) {
                    resolve();
                    return;
                }

                retries++;
                if (retries > webProcessRetires) { 
                    reject("Max web process retries!");
                    return;
                }

                setTimeout(timeoutCallback, webProcessWait);
            };
            setTimeout(timeoutCallback, webProcessWait);
        });
    }, 100000);
    afterAll(() => {
        webProcess.kill();
    });

    it("should provide token on successful login", async () => {
        const response = await fetch("https://localhost:4433", {
            method: "POST",
            body: JSON.stringify({
                emailAddress: "administrator@localhost",
                password: "Welcome123"
            })
        });

        const data = await response.json();

    }, 100000);
});