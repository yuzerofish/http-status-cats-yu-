export interface HttpStatus {
  code: number;
  description: string;
  geekDescription: string;
  mdnSource?: string;
}

export const httpStatuses: HttpStatus[] = [
  { 
    code: 100, 
    description: "Continue", 
    geekDescription: "就像你第一次约会，对方说'继续'，但你还是不确定要不要牵手。",
    mdnSource: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100"
  },
  { 
    code: 101, 
    description: "Switching Protocols", 
    geekDescription: "从 HTTP 切换到 HTTPS，就像从自行车换成电动车，突然感觉高大上了。",
    mdnSource: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101"
  },
  // ... Add more status codes here
  { 
    code: 503, 
    description: "Service Unavailable", 
    geekDescription: "服务不可用，就像你准备通宵写代码，结果发现咖啡机坏了。",
    mdnSource: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503"
  },
]