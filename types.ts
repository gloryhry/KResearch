
export type ResearchUpdateType = 'thought' | 'search' | 'read' | 'outline';
export type AgentPersona = 'Alpha' | 'Beta';
export type ResearchMode = 'Balanced' | 'DeepDive' | 'Fast' | 'UltraFast';
export type AppState = 'idle' | 'clarifying' | 'researching' | 'paused' | 'complete' | 'synthesizing';
export type AgentRole = 'planner' | 'searcher' | 'synthesizer' | 'clarification' | 'visualizer' | 'outline' | 'roleAI';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type TranslationStyle = 'literal' | 'colloquial';
export type ApiProvider = 'gemini' | 'openai';


export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

export interface ModelOverrides {
    [key: string]: string | null;
}

export interface ResearchParams {
    minCycles: number;
    maxCycles: number;
    maxDebateRounds: number;
}

export interface AppSettings {
    modelOverrides: ModelOverrides;
    researchParams: ResearchParams;
}

export interface ClarificationTurn {
    role: 'user' | 'model';
    content: string;
}

export interface ResearchUpdate {
  id: number;
  type: ResearchUpdateType;
  persona?: AgentPersona;
  // For 'search', content can be an array of queries.
  content: string | string[];
  // For 'search' and 'read', source can be an array of URLs.
  source?: string | string[];
}

export interface Citation {
  url: string;
  title: string;
}

export interface ReportVersion {
  content: string;
  version: number;
}

export interface FinalResearchData {
  reports: ReportVersion[];
  activeReportIndex: number;
  citations: Citation[];
  researchTimeMs: number;
  searchCycles: number;
  researchUpdates: ResearchUpdate[];
}

export interface FileData {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string
}

export interface Role {
    id: string;
    name: string;
    emoji: string;
    prompt: string;
    isBuiltIn: boolean;
    file?: FileData | null;
}

export interface HistoryItem {
  id: string;
  query: string;
  title?: string;
  mode: ResearchMode;
  roleId?: string | null;
  finalData: FinalResearchData;
  clarificationHistory: ClarificationTurn[];
  selectedFile: FileData | null;
  date: string; // ISO string
  initialSearchResult: { text: string; citations: Citation[] } | null;
  clarifiedContext: string;
}

export interface GenerateContentParams {
  model: string;
  contents: any;
  config?: {
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
    [key: string]: any;
  };
}

export interface GenerateContentResponse {
  text: string;
  candidates?: any[];
  [key: string]: any;
}

export interface AIClient {
  generateContent(params: GenerateContentParams): Promise<GenerateContentResponse>;
}