import { useState } from 'react';

const API_BASE_URL = '/api'; // Use Next.js API proxy

export interface FaceSearchResult {
  vectorId: string | null;
  matchScore: number;
  message: string;
}

export const useFaceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);
  const [searchResult, setSearchResult] = useState<FaceSearchResult | null>(null);

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
    setSearchResult(null);
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
        const matchScore = data.match_score || 0;
        const vectorId = data.matched_user_id || null;
        const score = `${(matchScore * 100).toFixed(1)}%`;
        
        setSearchResult({
          vectorId,
          matchScore,
          message: vectorId 
            ? `Match found with ${score} confidence` 
            : 'No matching face found'
        });
        
        setResult(vectorId ? `Match Score: ${score}` : 'No matching face found');
        setIsSuccess(!!vectorId);
        
        return { vectorId, matchScore };
      } else {
        setResult(`❌ Error: ${data.error || 'Search failed'}`);
        setIsSuccess(false);
        return { vectorId: null, matchScore: 0 };
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
      setIsSuccess(false);
      return { vectorId: null, matchScore: 0 };
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, isSuccess, addFace, searchFace, searchResult };
};
