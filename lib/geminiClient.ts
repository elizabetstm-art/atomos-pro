/**
 * Gemini / Gemini API configuration placeholder.
 * Installer la dépendance adéquate ou utiliser fetch côté serveur.
 */
import { env } from './env';

export const geminiApiKey = env.GEMINI_API_KEY;

export const geminiConfig = {
  apiKey: geminiApiKey,
  baseUrl: 'https://api.openai.com/v1',
};
