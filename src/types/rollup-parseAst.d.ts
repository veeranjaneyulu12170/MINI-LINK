declare module 'rollup/parseAst' {
  export interface ParseAstOptions {
    // Add any options you need here
  }
  
  export function parseAst(code: string, options?: ParseAstOptions): any;
  
  export default parseAst;
} 