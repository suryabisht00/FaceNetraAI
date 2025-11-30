import { useState } from 'react';

const API_BASE_URL = '/api'; // Use Next.js API proxy

export const useFaceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);

  const addFace = async (image: File, name: string, metadata: string) => {
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('image', image);
    formData.append('name', name);
    formData.append('metadata', metadata);

    try {
      const response = await fetch(`${API_BASE_URL}/faces`, {
        method: 'POST',
        body: formData, // Remove X-API-Key header, handled by proxy
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResult(`✅ Face added successfully! Person ID: ${data.data.person_id}`);
        setIsSuccess(true);
      } else {
        setResult(`❌ Error: ${data.error || 'Failed to add face'}`);
        setIsSuccess(false);
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const searchFace = async (image: File, threshold: number) => {
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('action', 'search');
    formData.append('image', image);
    formData.append('threshold', threshold.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/faces`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        const score = data.match_score ? `${(data.match_score * 100).toFixed(1)}%` : '0%';
        const userId = data.matched_user_id || 'None';
        setResult(`Match Score: ${score}, Matched User ID: ${userId}`);
        setIsSuccess(true);
      } else {
        setResult(`❌ Error: ${data.error || 'Search failed'}`);
        setIsSuccess(false);
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, isSuccess, addFace, searchFace };
};
