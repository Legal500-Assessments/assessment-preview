// Simple URLPattern replacement for Node.js
export class URLPattern {
  private pathPattern: string;
  private paramNames: string[] = [];
  private regex: RegExp;

  constructor(options: { pathname: string }) {
    this.pathPattern = options.pathname;
    
    // Extract parameter names and create regex
    let regexPattern = this.pathPattern;
    const paramRegex = /:(\w+)/g;
    let match;
    
    while ((match = paramRegex.exec(this.pathPattern)) !== null) {
      this.paramNames.push(match[1]);
    }
    
    // Convert path pattern to regex
    regexPattern = regexPattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
      .replace(/:(\w+)/g, '([^/]+)'); // Replace :param with capture group
    
    this.regex = new RegExp(`^${regexPattern}$`);
  }

  exec(url: URL): any | null {
    const pathname = url.pathname;
    const match = this.regex.exec(pathname);
    
    if (!match) {
      return null;
    }
    
    const groups: Record<string, string> = {};
    this.paramNames.forEach((name, index) => {
      groups[name] = match[index + 1];
    });
    
    return {
      pathname: {
        groups
      }
    };
  }
}