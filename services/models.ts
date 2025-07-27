import { settingsService } from './settingsService';
import { apiKeyService } from './apiKeyService';
import { ResearchMode, AgentRole, ApiProvider } from '../types';

const defaultGeminiModels: Record<AgentRole, Record<ResearchMode, string>> = {
    planner: {
        Balanced: 'gemini-2.5-pro',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite',
    },
    searcher: {
        Balanced: 'gemini-2.5-flash-lite',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite',
    },
    outline: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite',
    },
    synthesizer: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite',
    },
    clarification: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite',
    },
    visualizer: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-pro',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash-lite',
    },
    roleAI: {
        Balanced: 'gemini-2.5-flash',
        DeepDive: 'gemini-2.5-flash',
        Fast: 'gemini-2.5-flash',
        UltraFast: 'gemini-2.5-flash',
    }
};

const defaultOpenAIModels: Record<AgentRole, Record<ResearchMode, string>> = {
    planner: {
        Balanced: 'gpt-4o',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    },
    searcher: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    },
    outline: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    },
    synthesizer: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    },
    clarification: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    },
    visualizer: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    },
    roleAI: {
        Balanced: 'gpt-4o-mini',
        DeepDive: 'gpt-4o-mini',
        Fast: 'gpt-4o-mini',
        UltraFast: 'gpt-4o-mini',
    }
};

export const getDefaultModelForRole = (role: AgentRole, mode: ResearchMode, provider?: ApiProvider): string => {
    const selectedProvider = provider || apiKeyService.getApiProvider();
    const defaultModels = selectedProvider === 'openai' ? defaultOpenAIModels : defaultGeminiModels;
    return defaultModels[role][mode];
}

/**
 * Gets the appropriate model for a given agent role and research mode.
 * It first checks for a user-defined override in settings, then falls back
 * to the default model for the selected mode and API provider.
 * @param role The role of the agent (e.g., 'planner', 'searcher').
 * @param mode The current research mode (e.g., 'Balanced', 'DeepDive').
 * @returns The name of the model to be used.
 */
export const getModel = (role: AgentRole, mode: ResearchMode): string => {
    const override = settingsService.getSettings().modelOverrides[role];
    if (override) {
        return override;
    }
    return getDefaultModelForRole(role, mode);
};
