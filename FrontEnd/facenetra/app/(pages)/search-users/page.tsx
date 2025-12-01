'use client';

import { useState } from 'react';
import { Search, Upload, Sliders, Camera } from 'lucide-react';
import { Button } from '@/components/realtime/ui/button';
import { useFaceAPI } from '@/lib/hooks/useFaceAPI';
import { useUserSearch } from '@/lib/hooks/useUserSearch';
import UserProfileView from '@/components/profile/UserProfileView';

type ViewState = 'upload' | 'searching' | 'profile' | 'error';

export default function SearchUsersPage() {
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(0.6);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const { loading: faceLoading, searchFace, searchResult } = useFaceAPI();
  const { loading: userLoading, userData, fetchUserByVectorId, loadMorePosts, reset } = useUserSearch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image.');
      return;
    }

    setViewState('searching');
    
    try {
      // Step 1: Search for face
      const result = await searchFace(image, threshold);
      
      if (!result.vectorId) {
        setViewState('error');
        return;
      }

      setMatchScore(result.matchScore);

      // Step 2: Fetch user profile and posts
      await fetchUserByVectorId(result.vectorId);
      setViewState('profile');
    } catch (error) {
      console.error('Search error:', error);
      setViewState('error');
    }
  };

  const handleReset = () => {
    setViewState('upload');
    setImage(null);
    setImagePreview(null);
    setMatchScore(null);
    reset();
  };

  const handleLoadMore = () => {
    if (userData?.profile.vectorId) {
      loadMorePosts(userData.profile.vectorId);
    }
  };

  // Profile View
  if (viewState === 'profile' && userData) {
    return (
      <UserProfileView
        profile={userData.profile}
        posts={userData.posts}
        onBack={handleReset}
        onLoadMore={handleLoadMore}
        hasMore={userData.pagination.hasMore}
        loading={userLoading}
      />
    );
  }

  // Upload/Search View
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#0B0F1A] pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Camera className="w-10 h-10 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Face Search</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Upload a photo to find matching profiles
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-[#0B0F1A] border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="flex text-sm font-semibold mb-3 text-gray-300 items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Select Image
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-xl border-2 border-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border-2 border-primary/30 bg-[#1a1f2e] text-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                required
              />
            </div>

            {/* Threshold Slider */}
            {/* <div>
              <label className="text-sm font-semibold mb-3 text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  Similarity Threshold
                </span>
                <span className="text-primary font-bold">{(threshold * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#1a1f2e] rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Less Strict</span>
                <span>More Strict</span>
              </div>
            </div> */}

            {/* Search Button */}
            <Button
              type="submit"
              disabled={faceLoading || userLoading || !image}
              className="w-full bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {faceLoading || userLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {faceLoading ? 'Searching Face...' : 'Loading Profile...'}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </Button>
          </form>

          {/* Results */}
          {viewState === 'searching' && searchResult && (
            <div className="mt-6 p-4 rounded-xl border-l-4 bg-blue-50/10 border-blue-500 text-blue-300">
              <p className="font-medium">{searchResult.message}</p>
            </div>
          )}

          {viewState === 'error' && (
            <div className="mt-6 p-4 rounded-xl border-l-4 bg-red-50/10 border-red-500 text-red-300">
              <p className="font-medium mb-2">No matching face found</p>
              <p className="text-sm text-gray-400">
                Try uploading a different image or adjusting the similarity threshold.
              </p>
              <button
                onClick={handleReset}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Try another search
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        {/* <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            How it works
          </h3>
          <ul className="text-sm text-gray-400 space-y-1 ml-7">
            <li>• Upload a clear photo of a person's face</li>
            <li>• Our AI will search for matching profiles</li>
            <li>• View their public profile and posts</li>
            <li>• Adjust threshold for stricter or looser matches</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
