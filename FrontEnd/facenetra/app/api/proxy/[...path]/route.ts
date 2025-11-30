import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:5000';
const API_KEY = 'dz_live_2024_secure_api_key_xyz789';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await params to avoid sync dynamic API error
  const params = await context.params;
  const path = Array.isArray(params?.path) ? params.path.join('/') : '';
  const url = new URL(request.url);
  const queryString = url.search;
  try {
    const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await params to avoid sync dynamic API error
  const params = await context.params;
  const path = Array.isArray(params?.path) ? params.path.join('/') : '';
  const body = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}
