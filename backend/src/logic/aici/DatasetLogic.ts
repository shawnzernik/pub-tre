import { Message } from "common/src/models/aici/Message";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";

export class DatasetLogic {
    static async createDataset(ds: EntitiesDataSource): Promise<string> {
        const dataset = await ds.datasetRepository().findBy({ includeInTraining: true });

        let ret = "";

        for (let data of dataset) {
            const messages: Message[] = JSON.parse(data.json);
            const cleanMessages: Message[] = [];
            for (let msg of messages) {
                cleanMessages.push({
                    role: msg.role,
                    content: msg.content
                });
            }

            ret += JSON.stringify({ messages: cleanMessages }) + "\n";
        }

        return ret;
    }

}