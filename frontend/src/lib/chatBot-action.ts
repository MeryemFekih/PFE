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

  const data = await res.json();
  return Array.isArray(data) ? data : data.updatedMessages ?? [];
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
// lib/chatBot-action.ts
export async function getConversations(token: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
  console.log('BACKEND_URL:', BACKEND_URL);

  const res = await fetch(`${BACKEND_URL}/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('res.status:', res.status);

  if (!res.ok) {
    const errText = await res.text();
    console.error('Failed to fetch conversations:', res.status, errText);
    throw new Error('Failed to fetch conversations');
  }

  const data = await res.json();
  console.log('Conversations data:', data);
  return data;
}


export async function getMessagesByConversationId(conversationId: number, accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/messages/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  const data = await res.json();
  return Array.isArray(data) ? data : data.updatedMessages ?? [];
}

export async function deleteConversation(id: number, accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/conversations/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('Failed to delete conversation');
  return res.json();
}