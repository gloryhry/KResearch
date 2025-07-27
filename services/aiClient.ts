import { apiKeyService } from "./apiKeyService";
import { ai as geminiClient } from "./geminiClient";
import { openaiClient } from "./openaiClient";
import { AIClient, GenerateContentParams, GenerateContentResponse } from "../types";

class UnifiedAIClient implements AIClient {
    async generateContent(params: GenerateContentParams): Promise<GenerateContentResponse> {
        const provider = apiKeyService.getApiProvider();
        
        if (provider === 'openai') {
            return openaiClient.generateContent(params);
        } else {
            return geminiClient.generateContent(params);
        }
    }
}

export const ai = new UnifiedAIClient();

// For backward compatibility, also export the models property
(ai as any).models = {
    generateContent: (params: any): Promise<any> => {
        return ai.generateContent(params);
    },
};