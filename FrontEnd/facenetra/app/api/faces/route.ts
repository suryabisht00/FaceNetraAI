import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:5000';
const API_KEY = 'dz_live_2024_secure_api_key_xyz789';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the form data to the backend
    const backendFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      backendFormData.append(key, value);
    }

    const response = await fetch(`${API_BASE_URL}/faces`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
      },
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
