
import React from 'react';
import { apiKeyService } from '../../services/apiKeyService';
import { useLanguage } from '../../contextx/LanguageContext';
import { ApiProvider } from '../../types';

interface ApiSettingsProps {
    apiKey: string;
    setApiKey: (key: string) => void;
    apiBaseUrl: string;
    setApiBaseUrl: (url: string) => void;
    apiProvider: ApiProvider;
    setApiProvider: (provider: ApiProvider) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({ 
    apiKey, 
    setApiKey, 
    apiBaseUrl, 
    setApiBaseUrl, 
    apiProvider, 
    setApiProvider 
}) => {
    const { t } = useLanguage();
    const isEnvKey = apiKeyService.isEnvKey();

    const getKeyLabel = () => {
        return apiProvider === 'openai' ? t('openaiApiKeys') : t('geminiApiKeys');
    };

    const getKeyPlaceholder = () => {
        return apiProvider === 'openai' ? t('openaiApiKeysPlaceholder') : t('apiKeysPlaceholder');
    };

    const getDefaultBaseUrl = () => {
        return apiProvider === 'openai' ? 'https://api.openai.com' : 'https://generativelanguage.googleapis.com';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('apiProvider')}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('apiProviderDesc')}</p>
                <select
                    value={apiProvider}
                    onChange={(e) => setApiProvider(e.target.value as ApiProvider)}
                    className="w-full p-3 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-1 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isEnvKey}
                >
                    <option value="gemini">{t('geminiProvider')}</option>
                    <option value="openai">{t('openaiProvider')}</option>
                </select>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{getKeyLabel()}</h3>
                {isEnvKey ? (
                    <div className="w-full p-3 rounded-2xl bg-slate-200/60 dark:bg-black/20 text-gray-500 dark:text-gray-400 border border-transparent">
                        {t('apiKeysConfiguredByHost')}
                    </div>
                ) : (
                    <textarea 
                        id="api-key-input"
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={getKeyPlaceholder()}
                        className="w-full h-24 p-3 rounded-2xl resize-none bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-1 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all text-sm"
                        aria-label={getKeyLabel()}
                    />
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('apiBaseUrl')}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('apiBaseUrlDesc')}</p>
                <input 
                    id="api-base-url-input"
                    type="url"
                    value={apiBaseUrl} 
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    placeholder={getDefaultBaseUrl()}
                    className="w-full p-3 rounded-2xl bg-white/60 dark:bg-black/20 border border-transparent focus:border-glow-light dark:focus:border-glow-dark focus:ring-1 focus:ring-glow-light/50 dark:focus:ring-glow-dark/50 focus:outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="API Base URL"
                    disabled={isEnvKey}
                />
            </div>
        </div>
    );
};

export default ApiSettings;
