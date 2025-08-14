export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    page: string | number;
    source?: string;
  }>;
}

export interface Source {
  source: string;
  title: string;
  page: number;
}

export interface ChatResponse {
  response: string;
  sources: Source[];
}