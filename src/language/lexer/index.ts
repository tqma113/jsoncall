export const createLexer = (source: string) => {

  /**
   * The previously focused non-ignored token.
   */
   let lastToken: Token;

   /**
    * The currently focused non-ignored token.
    */
   let token: Token;
 
   /**
    * The (1-indexed) line containing the current token.
    */
   let line: number;
 
   /**
    * The character offset at which the current line begins.
    */
   let lineStart: number;

}