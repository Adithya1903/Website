import { shapeProxyChatBody } from '../lib/websiteChat.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const DATA_ROOM_URL = process.env.DATA_ROOM_CHAT_URL;
  const API_KEY = process.env.DATA_ROOM_API_KEY;

  if (!DATA_ROOM_URL) {
    return new Response(
      JSON.stringify({ error: 'Chat backend not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const outbound = shapeProxyChatBody(body);

    const headers = { 'Content-Type': 'application/json' };
    if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

    const response = await fetch(DATA_ROOM_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(outbound),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Chat backend returned an error' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to connect to chat backend' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
