
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.FACE_RECOGNITION_API_URL;
const API_KEY = process.env.FACE_RECOGNITION_API_KEY ;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the form data to the backend
    const backendFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }

    const headers = new Headers();
    if (API_KEY) headers.append('X-API-Key', API_KEY);
    const response = await fetch(`${API_BASE_URL}/faces`, {
      method: 'POST',
      headers,
      body: backendFormData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}
