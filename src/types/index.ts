export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  properties?: Record<string, any>;
  type?: string;
  color?: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  properties?: Record<string, any>;
  type?: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface ModelConfig {
  type: 'deepseek' | 'qianwen';
  apiKey: string;
  apiEndpoint?: string;
  modelVersion?: string;
}

export interface ParseResult {
  success: boolean;
  graph?: Graph;
  error?: string;
} 