// Basic Vite client type definitions
interface ImportMeta {
  url: string;
  env: Record<string, string>;
  hot?: {
    accept: (callback?: (modules: any[]) => void) => void;
    dispose: (callback: (data: any) => void) => void;
    data: any;
    invalidate: () => void;
    decline: () => void;
  };
  glob?: (pattern: string) => Record<string, () => Promise<any>>;
} 