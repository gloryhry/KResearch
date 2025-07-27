import { apiKeyService, AllKeysFailedError } from "./apiKeyService";
import { AIClient, GenerateContentParams, GenerateContentResponse } from "../types";

// Helper to get a clean error message from various error types
const getCleanErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred.';
    if (typeof error === 'string') return error;

    if (error.message && typeof error.message === 'string') {
        try {
            const parsed = JSON.parse(error.message);
            return parsed?.error?.message || error.message;
        } catch (e) {
            return error.message;
        }
    }
    if (error.str && typeof error.str === 'string') return error.str;
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null) {
        try { return JSON.stringify(error, null, 2); }
        catch { return 'Received an un-stringifiable error object.'; }
    }
    return String(error);
};

// Helper to sanitize potentially large objects for logging
const sanitizeForLogging = (obj: any, truncateLength: number = 500) => {
    if (!obj) return obj;
    try {
        return JSON.parse(JSON.stringify(obj, (key, value) => {
            if (typeof value === 'string' && value.length > truncateLength) {
                return value.substring(0, truncateLength) + '...[TRUNCATED]';
            }
            return value;
        }));
    } catch (e) {
        return { error: "Failed to sanitize for logging" };
    }
};

// Converts Gemini-style contents to OpenAI chat format
function formatContentsForOpenAI(contents: any): any[] {
    if (typeof contents === 'string') {
        return [{ role: 'user', content: contents }];
    }
    if (Array.isArray(contents)) {
        return contents.map((content: any) => {
            const role = content.role === 'model' ? 'assistant' : content.role || 'user';
            const text = content.parts?.map((part: any) => part.text).join('\n') || content.text || '';
            return { role, content: text };
        });
    }
    if (typeof contents === 'object' && contents !== null && contents.parts) {
        const role = contents.role === 'model' ? 'assistant' : contents.role || 'user';
        const text = contents.parts?.map((part: any) => part.text).join('\n') || '';
        return [{ role, content: text }];
    }
    console.warn("Unknown contents format, passing through:", contents);
    return [{ role: 'user', content: String(contents) }];
}

// Maps the Gemini-style params to OpenAI chat completions format
function mapToOpenAIBody(params: GenerateContentParams): object {
    const messages = formatContentsForOpenAI(params.contents);
    
    // Add system instruction as system message if provided
    if (params.config?.systemInstruction) {
        messages.unshift({ role: 'system', content: params.config.systemInstruction });
    }

    const body: any = {
        model: params.model,
        messages,
    };

    // Map config parameters to OpenAI format
    if (params.config) {
        if (params.config.temperature !== undefined) {
            body.temperature = params.config.temperature;
        }
        if (params.config.maxOutputTokens !== undefined) {
            body.max_tokens = params.config.maxOutputTokens;
        }
    }

    return body;
}

class OpenAIClient implements AIClient {
    async generateContent(params: GenerateContentParams): Promise<GenerateContentResponse> {
        const keys = apiKeyService.getApiKeys();
        if (keys.length === 0) {
            throw new Error("No API keys provided. Please add at least one key in the application settings.");
        }

        const maxRetriesPerKeyCycle = 3;
        const maxAttempts = keys.length * maxRetriesPerKeyCycle;
        let lastError: any = null;
        const baseUrl = apiKeyService.getApiBaseUrl();
        
        // Use OpenAI chat completions endpoint
        const url = `${baseUrl}/v1/chat/completions`;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const key = apiKeyService.getNextApiKey();
            if (!key) continue;

            console.log(`[OpenAI API Request] URL: ${url}, Attempt: ${attempt}/${maxAttempts}, Key: ...${key.slice(-4)}`);
            console.log(`[OpenAI API Request] Parameters:`, sanitizeForLogging(params, 4000));

            try {
                const body = mapToOpenAIBody(params);
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${key}`
                    },
                    body: JSON.stringify(body)
                });

                const responseText = await response.text();

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(responseText);
                    } catch {
                        const err = new Error(`OpenAI API Error: ${response.status} - ${responseText}`);
                        (err as any).status = response.status;
                        throw err;
                    }
                    const err = new Error(errorData?.error?.message || `OpenAI API Error: ${response.status}`);
                    (err as any).status = response.status;
                    (err as any).data = errorData;
                    throw err;
                }
                
                const result = JSON.parse(responseText);

                // Convert OpenAI response to Gemini-like format
                const sdkLikeResponse: GenerateContentResponse = {
                    text: result?.choices?.[0]?.message?.content ?? '',
                    candidates: [{
                        content: {
                            parts: [{ text: result?.choices?.[0]?.message?.content ?? '' }]
                        }
                    }],
                    ...result,
                };

                console.log(`[OpenAI API Success] Model: ${params.model}`);
                console.log(`[OpenAI API Response]:`, sanitizeForLogging(sdkLikeResponse));
                apiKeyService.reset(); // Reset key rotation for next independent operation
                return sdkLikeResponse;

            } catch (error: any) {
                const errorMessage = getCleanErrorMessage(error);
                console.warn(`[OpenAI API Call Failed: Attempt ${attempt}/${maxAttempts}] Model: '${params.model}' with key ...${key.slice(-4)}. Error: ${errorMessage}`);
                lastError = error;
                
                if (error.status === 429) {
                    // Rate limit error, let's wait and retry
                    const currentCycle = Math.floor((attempt - 1) / keys.length) + 1;
                    let delayMs = 2000 * currentCycle; // Exponential backoff

                    console.log(`[OpenAI API Retry] Rate limit hit. Applying exponential backoff of ${delayMs}ms. Waiting...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    // Continue to the next attempt after the delay
                }
            }
        }

        const finalErrorMessage = getCleanErrorMessage(lastError);
        console.error(`[OpenAI API Error: All Keys Failed] Model: '${params.model}'. Last error: ${finalErrorMessage}`);
        console.error(`[OpenAI API Error] Failed Parameters:`, sanitizeForLogging(params, 4000));
        throw new AllKeysFailedError(`All API keys failed. Last error: ${finalErrorMessage}`);
    }
}

export const openaiClient = new OpenAIClient();