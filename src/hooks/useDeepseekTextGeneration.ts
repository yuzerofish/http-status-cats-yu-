import { useState } from 'react';
import fs from 'fs/promises';
import path from 'path';
import { HttpStatus } from '../types/http-status'; // Adjust the path as needed

interface TextGenerationResponse {
  choices: {
    text: string;
  }[];
}

export function useDeepseekTextGeneration() {
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.deepseek.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data: TextGenerationResponse = await response.json();
      setGeneratedText(data.choices[0].text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { generateText, generatedText, isLoading, error };
}

export async function generateHttpStatusCatPrompts(httpStatuses: HttpStatus[]) {
  const generatePrompt = async (status: HttpStatus) => {
    const catType = getCatType(status.code);
    const prompt = `Generate a humorous and satirical image description for HTTP status ${status.code} (${status.description}). The main subject should be a ${catType}. The image should represent the status's meaning in a witty way, considering the geek description: "${status.geekDescription}". Describe a static scene with specific details about the cat's appearance, action, and surroundings.`;

    // 打印传送给 Deepseek 的 prompt
    console.log(`Prompt sent to Deepseek for status ${status.code}:`, prompt);

    try {
      const response = await fetch('https://api.deepseek.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate prompt: ${response.statusText}`);
      }

      const data: TextGenerationResponse = await response.json();
      const generatedPrompt = data.choices[0].text.trim();

      // 打印 Deepseek 返回的具体 prompt
      console.log(`Prompt received from Deepseek for status ${status.code}:`, generatedPrompt);

      return generatedPrompt;
    } catch (err) {
      console.error(`Error generating prompt for status ${status.code}:`, err);
      return null;
    }
  };

  const prompts = await Promise.all(httpStatuses.map(generatePrompt));

  // Save prompts to files
  await Promise.all(prompts.map(async (prompt, index) => {
    if (prompt) {
      const status = httpStatuses[index];
      const fileName = `${status.code}.txt`;
      const filePath = path.join(process.cwd(), 'src', 'prompts', 'http-status-cats', fileName);
      try {
        await fs.writeFile(filePath, prompt);
      } catch (err) {
        console.error(`Error saving prompt for status ${status.code}:`, err);
      }
    }
  }));

  return prompts;
}

function getCatType(code: number): string {
  if (code >= 500) return "black cat";
  if (code >= 400) return "orange tabby cat";
  if (code >= 300) return "tiger-striped cat";
  if (code >= 200) return "calico cat";
  return "cow-patterned cat";
}