'use client';

import { useState } from 'react';
import { Button } from '@/components/realtime/ui/button';
import { useFaceAPI } from '@/lib/hooks/useFaceAPI';
import { Upload, Search, Sliders } from 'lucide-react'; // Assuming Lucide React is installed

export default function SearchFace() {
  const [image, setImage] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.6);
  const { loading, result, isSuccess, searchFace } = useFaceAPI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      searchFace(image, threshold);
    } else {
      alert('Please select an image.');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
        <Search className="w-8 h-8 text-purple-500" />
        Search Similar Faces
      </h2>
      <div className="max-w-md mx-auto bg-linear-to-br from-purple-50 to-pink-100 p-6 rounded-2xl shadow-lg border border-purple-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex text-sm font-semibold mb-2 text-gray-700 items-center gap-2">
              <Upload className="w-4 h-4" />
              Select Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Similarity Threshold: {threshold}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        {result && (
          <div
            className={`mt-6 p-4 rounded-xl border-l-4 transition-all duration-300 ${
              isSuccess ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
