import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

export async function generateImage(prompt: string) {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}