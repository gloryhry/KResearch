import { apiKeyService } from './apiKeyService';
import { AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  modelOverrides: {
    planner: null,
    searcher: null,
    outline: null,
    synthesizer: null,
    clarification: null,
    visualizer: null,
  },
  researchParams: {
    minCycles: 3,
    maxCycles: 10,
    maxDebateRounds: 10,
  },
};

class SettingsService {
  private settings: AppSettings;
  private availableModels: string[] = [];

  constructor() {
    this.settings = this.load();
  }

  private load(): AppSettings {
    try {
      const storedSettings = localStorage.getItem('k-research-settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        return {
          modelOverrides: { ...DEFAULT_SETTINGS.modelOverrides, ...parsed.modelOverrides },
          researchParams: { ...DEFAULT_SETTINGS.researchParams, ...parsed.researchParams },
        };
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  public save(newSettings: AppSettings) {
    const toStore: AppSettings = {
        modelOverrides: newSettings.modelOverrides || this.settings.modelOverrides,
        researchParams: newSettings.researchParams || this.settings.researchParams,
    };
    try {
      localStorage.setItem('k-research-settings', JSON.stringify(toStore));
      this.settings = toStore;
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }

  public getSettings(): AppSettings {
    return this.settings;
  }
  
  public async fetchAvailableModels(forceRefetch: boolean = false): Promise<string[]> {
    const apiKeys = apiKeyService.getApiKeys();
    if (apiKeys.length === 0) {
      this.availableModels = [];
      throw new Error("API Key not set.");
    }
    
    if (this.availableModels.length > 0 && !forceRefetch) return this.availableModels;

    const allModelNames = new Set<string>();
    let lastError: any = null;
    const baseUrl = apiKeyService.getApiBaseUrl();

    for (const key of apiKeys) {
        try {
            const response = await fetch(`${baseUrl}/v1beta/models?pageSize=50`, {
                headers: { 'x-goog-api-key': key }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error?.message || response.statusText;
                throw new Error(`Failed with key ending in ...${key.slice(-4)}: ${errorMessage}`);
            }

            const data = await response.json() as { models?: { name: string }[] };
            const modelNames = (data.models || [])
                .map((m: { name: string }) => m.name.replace(/^models\//, ''))
                .filter((name: string) => name.includes('gemini'));
            
            modelNames.forEach(name => allModelNames.add(name));
            // We only need one successful key to get the models.
            lastError = null; 
            break;
        } catch (error) {
            console.warn(`Could not fetch models for one of the keys:`, error);
            lastError = error;
        }
    }

    if (allModelNames.size === 0) {
        console.error("Error fetching available models from any key:", lastError);
        this.availableModels = [];
        throw lastError || new Error("Failed to fetch models from any of the provided API keys.");
    }
    
    this.availableModels = Array.from(allModelNames).sort();
    return this.availableModels;
  }
}

export const settingsService = new SettingsService();