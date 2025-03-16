interface ImportMeta {
  url: string;
  env: Record<string, string>;
  hot?: {
    accept: (callback?: (modules: any[]) => void) => void;
    dispose: (callback: (data: any) => void) => void;
    data: any;
  };
  glob?: (pattern: string) => Record<string, () => Promise<any>>;
} 