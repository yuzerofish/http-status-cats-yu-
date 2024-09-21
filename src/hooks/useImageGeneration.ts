import { useState } from 'react';

interface ImageGenerationResponse {
  data: {
    url: string;
  }[];
}

export function useImageGeneration() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai-hk.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "flux",
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data: ImageGenerationResponse = await response.json();
      setImageUrl(data.data[0].url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, imageUrl, isLoading, error };
}