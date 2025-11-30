import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.FACE_RECOGNITION_API_URL;
const API_KEY = process.env.FACE_RECOGNITION_API_KEY ;

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
    const headers = new Headers();
    if (API_KEY) headers.append('X-API-Key', API_KEY);
    headers.append('Content-Type', 'application/json');
    const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
      method: 'GET',
      headers,
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
    const headers = new Headers();
    if (API_KEY) headers.append('X-API-Key', API_KEY);
    headers.append('Content-Type', 'application/json');
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: 'POST',
      headers,
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
