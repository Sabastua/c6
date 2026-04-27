import { OpenAI } from 'openai';

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://djc6.com',
    'X-Title': 'DJ C6 Website',
  },
});

/**
 * Sends a simple prompt to Claude via OpenRouter and returns the text response.
 */
export const getClaudeResponse = async (prompt: string) => {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key is missing. Please add it to your .env.local file.');
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3-5-sonnet',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
};
