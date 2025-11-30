'use client';

import { useState } from 'react';
import { Button } from '@/components/realtime/ui/button';
import { useFaceAPI } from '@/lib/hooks/useFaceAPI';
import { Upload, User, FileText } from 'lucide-react'; // Assuming Lucide React is installed

export default function AddFace() {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [metadata, setMetadata] = useState('');
  const { loading, result, isSuccess, addFace } = useFaceAPI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image && name.trim()) {
      addFace(image, name.trim(), metadata.trim());
    } else {
      alert('Please select an image and enter a name.');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
        <User className="w-8 h-8 text-blue-500" />
        Add Face to Database
      </h2>
      <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-blue-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Select Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Person Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter person's name"
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Metadata (optional):
            </label>
            <input
              type="text"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder="Additional information"
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            {loading ? 'Adding...' : 'Add Face'}
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
