import { supabase } from './supabase';

const PROVISIONING_API_KEY = process.env.EXPO_PUBLIC_PROVISIONG_API_KEY_OPENROUTER;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/keys';

export async function generateOpenRouterKey(userId: string): Promise<string | null> {
  try {
    console.log('Starting OpenRouter key generation for user:', userId);
    
    if (!PROVISIONING_API_KEY) {
      console.error('Missing provisioning API key. Check your environment variables.');
      throw new Error('OpenRouter provisioning API key not found');
    }
    
    console.log('Making request to OpenRouter API');
    
    // Generate a new API key using the provisioning API
    const response = await fetch(`${OPENROUTER_API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PROVISIONING_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `user_${userId}`,
        label: 'userId',
      })
    });
    
    console.log('OpenRouter API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      // Get the full response body for debugging
      const responseText = await response.text();
      let errorMessage = `Status: ${response.status}, StatusText: ${response.statusText}`;
      
      try {
        // Try to parse it as JSON if possible
        const errorData = JSON.parse(responseText);
        errorMessage += `, Response: ${JSON.stringify(errorData)}`;
        throw new Error(`Failed to generate OpenRouter key: ${errorData.message || errorMessage}`);
      } catch (parseError) {
        // If it's not valid JSON, use the raw text
        errorMessage += `, Response: ${responseText}`;
        throw new Error(`Failed to generate OpenRouter key: ${errorMessage}`);
      }
    }
    
    const data = await response.json();
    console.log('Successfully received response from OpenRouter');
    
    // Log the structure of the response (excluding the actual API key for security)
    const responseStructure = {...data};
    if (responseStructure.key) responseStructure.key = '[REDACTED]';
    console.log('Response structure:', JSON.stringify(responseStructure));
    
    const apiKey = data.key;
    
    if (!apiKey) {
      console.error('API key missing from successful response');
      throw new Error('API key not found in response');
    }
    
    console.log('Saving API key to database');
    
    // Save the API key to the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ openrouter_key: apiKey })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error saving OpenRouter key to database:', updateError);
      return null;
    }
    
    console.log('Successfully generated and saved OpenRouter API key');
    return apiKey;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Detailed error generating OpenRouter key:', errorMessage);
    console.error('Error object:', error);
    return null;
  }
}