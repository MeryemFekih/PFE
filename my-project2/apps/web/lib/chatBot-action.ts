'use server';
import { BACKEND_URL } from "./constants";

export async function fetchAIResponse(
  messages: { role: string; content: string }[],
): Promise<string> {
  const API_KEY = process.env.NEXT_PUBLIC_CHATBOT_API_KEY || '';

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-llama-70b:free',
        messages,
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "Sorry, I didn't understand that.";
  } catch (error) {
    console.error('AI fetch failed:', error);
    return 'Error fetching response.';
  }
}


export async function createConversation(accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/conversations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
}

export async function sendUserMessage(conversationId: number, content: string, accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversationId, content }),
  });
  return res.json();
}

export async function saveAssistantMessage(conversationId: number, content: string, accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/messages/assistant`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversationId, content }),
  });
  return res.json();
}
