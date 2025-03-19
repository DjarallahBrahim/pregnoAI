import OpenAI from 'openai';
import { supabase } from './supabase';

export async function analyzeBloodTest(fileUri: string, userId: string): Promise<string> {
  try {
    // Get user's OpenRouter API key
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('openrouter_key')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.openrouter_key) {
      throw new Error('Failed to get OpenRouter API key');
    }

    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: profile.openrouter_key,
    });

    // Convert file to base64 if it's not already a URL
    let imageUrl = fileUri;
    if (!fileUri.startsWith('http')) {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      imageUrl = base64 as string;
    }

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-pro-exp-02-05:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a medical AI specialized in analyzing blood test reports. Given the attached image or file, detect if there are any abnormal values. If a problem exists, mention the abnormal parameter(s) and the most common reason(s) for the abnormality. Respond in the same language as the report (English or French). Do not summarize the entire report, only highlight issues"
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ]
    });

    return completion.choices[0].message.content || 'No analysis available';
  } catch (error) {
    console.error('Error analyzing blood test:', error);
    throw error;
  }
}