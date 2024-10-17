import { Message } from "common/src/models/aici/Message";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { EmbeddingListDto } from "../../models/EmbeddingListDto";
import { EmbeddingRequestDto } from "../../models/EmbeddingRequestDto";
import { Config } from "../../Config";
import { Response } from "common/src/models/aici/Response";
import { Logger } from "../../Logger";

export class ApiLogic {
    public static async chat(ds: EntitiesDataSource, body: Message[]): Promise<Response> {
        const modelSetting = await ds.settingRepository().findByKey("Aici:Model");
        const urlSetting = await ds.settingRepository().findByKey("Aici:URL");
        const apiKeySetting = await ds.settingRepository().findByKey("Aici:API Key");

        const request = {
            model: modelSetting.value,
            messages: body
        };

        const fetchResponse = await fetch(`${urlSetting.value}/v1/chat/completions`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const aiResponse = await fetchResponse.json();
        return aiResponse as Response;
    }

    public static async getExplanation(current: number, max: number, logger: Logger, ds: EntitiesDataSource, fileName: string, fileContents: string): Promise<Message[]> {
        let userMarkdown = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";
        userMarkdown = userMarkdown.replace("%FILE%", fileName);
        userMarkdown = userMarkdown.replace("%CONTENT%", fileContents.replace(/`/, "\\`"));

        const messages: Message[] = [{
            role: "user",
            content: userMarkdown
        }];

        const started = Date.now();
        const response = await ApiLogic.chat(ds, messages);
        const ended = Date.now();

        await logger.log(`AiciLogic.getExplanation() - ${current} of ${max} - Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
        await logger.log(`AiciLogic.getExplanation() - ${current} of ${max} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);

        messages.push({
            role: response.choices[0].message.role,
            content: response.choices[0].message.content
        });

        return messages;
    }    
    
    public static async getEmbedding(ds: EntitiesDataSource, content: string): Promise<EmbeddingListDto> {
        const response: EmbeddingListDto = await ApiLogic.embedding(ds, {
            model: Config.embeddingModel,
            input: content
        });
        return response;
    }
    private static async embedding(ds: EntitiesDataSource, request: EmbeddingRequestDto): Promise<EmbeddingListDto> {
        const urlSetting = await ds.settingRepository().findByKey("Aici:URL");
        const apiKeySetting = await ds.settingRepository().findByKey("Aici:API Key");
        const fetchResponse = await fetch(`${urlSetting.value}/v1/embeddings`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const aiResponse = await fetchResponse.json();
        return aiResponse as EmbeddingListDto;
    }
    
}