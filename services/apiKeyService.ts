import { ApiProvider } from "../types";

export class AllKeysFailedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AllKeysFailedError';
    }
}

const API_KEYS_STORAGE_KEY = 'gemini_api_keys';
const API_BASE_URL_STORAGE_KEY = 'gemini_api_base_url';
const API_PROVIDER_STORAGE_KEY = 'api_provider';
const DEFAULT_API_BASE_URL = 'https://generativelanguage.googleapis.com';
const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com';


class ApiKeyService {
    private userApiKeys: string[] = [];
    private readonly hasEnvKey: boolean;
    private currentKeyIndex = -1;
    private apiBaseUrl: string;
    private apiProvider: ApiProvider;

    constructor() {
        const envKey = process.env.API_KEY;
        this.hasEnvKey = !!envKey && envKey.length > 0;

        if (this.hasEnvKey) {
            this.userApiKeys = this.parseKeys(envKey);
        } else {
            try {
                const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
                this.userApiKeys = this.parseKeys(storedKeys || '');
            } catch (e) {
                console.warn("Could not access localStorage. API keys will not be persisted.");
                this.userApiKeys = [];
            }
        }

        try {
            const storedBaseUrl = localStorage.getItem(API_BASE_URL_STORAGE_KEY);
            const storedProvider = localStorage.getItem(API_PROVIDER_STORAGE_KEY) as ApiProvider;
            
            this.apiProvider = storedProvider || 'gemini';
            this.apiBaseUrl = storedBaseUrl || this.getDefaultBaseUrl();
        } catch (e) {
            console.warn("Could not access localStorage. API settings will not be persisted.");
            this.apiProvider = 'gemini';
            this.apiBaseUrl = DEFAULT_API_BASE_URL;
        }
    }
    
    private parseKeys(keysString: string): string[] {
        if (!keysString) return [];
        return keysString
            .split(/[\n,]+/)
            .map(k => k.trim())
            .filter(k => k.length > 0);
    }

    private getDefaultBaseUrl(): string {
        return this.apiProvider === 'openai' ? DEFAULT_OPENAI_BASE_URL : DEFAULT_API_BASE_URL;
    }

    public hasKey(): boolean {
        return this.getApiKeys().length > 0;
    }

    public isEnvKey(): boolean {
        return this.hasEnvKey;
    }
    
    public getApiKeys(): string[] {
        return this.userApiKeys;
    }

    public getApiKeysString(): string {
        return this.userApiKeys.join('\n');
    }

    public getApiBaseUrl(): string {
        return this.apiBaseUrl;
    }

    public getApiProvider(): ApiProvider {
        return this.apiProvider;
    }

    public getNextApiKey(): string | undefined {
        const keys = this.getApiKeys();
        if (keys.length === 0) {
            return undefined;
        }
        this.currentKeyIndex = (this.currentKeyIndex + 1) % keys.length;
        return keys[this.currentKeyIndex];
    }

    public setApiKeys(keysString: string): void {
        if (!this.isEnvKey()) {
            this.userApiKeys = this.parseKeys(keysString);
            try {
                if (this.userApiKeys.length > 0) {
                    localStorage.setItem(API_KEYS_STORAGE_KEY, keysString);
                } else {
                    localStorage.removeItem(API_KEYS_STORAGE_KEY);
                }
            } catch (e) {
                 console.warn("Could not access localStorage. API keys will not be persisted.");
            }
        }
    }

    public setApiBaseUrl(url: string): void {
        const newUrl = url.trim() || this.getDefaultBaseUrl();
        this.apiBaseUrl = newUrl;
        try {
            if (this.isEnvKey()) return; // Do not save if env key is present
            localStorage.setItem(API_BASE_URL_STORAGE_KEY, newUrl);
        } catch (e) {
            console.warn("Could not access localStorage. API base URL will not be persisted.");
        }
    }

    public setApiProvider(provider: ApiProvider): void {
        this.apiProvider = provider;
        
        // Update base URL to default for the new provider if it's currently a default URL
        const currentIsDefault = this.apiBaseUrl === DEFAULT_API_BASE_URL || this.apiBaseUrl === DEFAULT_OPENAI_BASE_URL;
        if (currentIsDefault) {
            this.apiBaseUrl = this.getDefaultBaseUrl();
        }
        
        try {
            if (this.isEnvKey()) return; // Do not save if env key is present
            localStorage.setItem(API_PROVIDER_STORAGE_KEY, provider);
            if (currentIsDefault) {
                localStorage.setItem(API_BASE_URL_STORAGE_KEY, this.apiBaseUrl);
            }
        } catch (e) {
            console.warn("Could not access localStorage. API provider will not be persisted.");
        }
    }

    public reset(): void {
        this.currentKeyIndex = -1;
    }
}

export const apiKeyService = new ApiKeyService();