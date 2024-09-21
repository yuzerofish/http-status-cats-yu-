import { generateHttpStatusCatPrompts } from './useDeepseekTextGeneration';
import { HttpStatus } from '../types/http-status';
import fs from 'fs/promises';
import path from 'path';

// 使用实际的 API 调用，不再 mock fetch
// 确保在运行测试之前设置了 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量

const httpStatuses: HttpStatus[] = [
  { code: 100, description: "Continue", geekDescription: "就像你第一次约会，对方说'继续'，但你还是不确定要不要牵手。" },
  { code: 200, description: "OK", geekDescription: "一切正常，就像你终于在 Stack Overflow 找到了完美答案，而且还不是过时的。" },
  { code: 404, description: "Not Found", geekDescription: "未找到，就像你在代码里搜索 bug，结果发现 bug 在你的逻辑里。" },
  { code: 500, description: "Internal Server Error", geekDescription: "服务器内部错误，就像你的大脑在被问及'你到底喜欢谁'时突然宕机。" },
];

// 仍然 mock fs.writeFile 以避免实际写入文件系统
jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
}));

describe('generateHttpStatusCatPrompts', () => {
  beforeAll(() => {
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      throw new Error('NEXT_PUBLIC_DEEPSEEK_API_KEY is not set');
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate prompts for all statuses', async () => {
    const prompts = await generateHttpStatusCatPrompts(httpStatuses);
    
    expect(prompts).toHaveLength(httpStatuses.length);
    prompts.forEach((prompt, index) => {
      expect(prompt).toBeTruthy(); // 确保每个 prompt 都有内容
      console.log(`Generated prompt for status ${httpStatuses[index].code}:`, prompt);
    });
  });

  it('should save prompts to files', async () => {
    await generateHttpStatusCatPrompts(httpStatuses);

    expect(fs.writeFile).toHaveBeenCalledTimes(httpStatuses.length);
    httpStatuses.forEach((status, index) => {
      const filePath = path.join(process.cwd(), 'src', 'prompts', 'http-status-cats', `${status.code}.txt`);
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, expect.any(String));
    });
  });
});