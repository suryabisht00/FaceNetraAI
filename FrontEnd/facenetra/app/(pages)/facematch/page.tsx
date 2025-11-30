'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddFace from '@/components/facesearch/AddFace';
import SearchFace from '@/components/facesearch/SearchFace';

export default function FaceSearch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-t-2xl">
            <TabsTrigger value="add" className="rounded-xl transition-all duration-300 hover:bg-white/20 data-[state=active]:bg-white data-[state=active]:text-blue-600 font-semibold">
              🤖 Add Face
            </TabsTrigger>
            <TabsTrigger value="search" className="rounded-xl transition-all duration-300 hover:bg-white/20 data-[state=active]:bg-white data-[state=active]:text-purple-600 font-semibold">
              🔍 Search Face
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="transition-opacity duration-500">
            <AddFace />
          </TabsContent>
          <TabsContent value="search" className="transition-opacity duration-500">
            <SearchFace />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

