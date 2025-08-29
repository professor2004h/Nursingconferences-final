'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryImage {
  asset?: { url: string; _id: string };
  alt?: string;
  caption?: string;
}

interface SimpleGallery {
  _id: string;
  title: string;
  conferenceDate: string;
  location: string;
  coverImage?: { asset?: { url: string }; alt?: string };
  galleryImages?: GalleryImage[];
}

const PastConferenceGalleryPage: React.FC = () => {
  const [galleries, setGalleries] = useState<SimpleGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/past-conference-gallery');
      const result = await response.json();
      if (result.success) {
        setGalleries(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <div className="bg-white border-b border-gray-200 py-12 mt-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:whitespace-nowrap leading-tight">CONFERENCE GALLERY</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:whitespace-nowrap leading-tight">CONFERENCE GALLERY</h1>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-12">
        {galleries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Photos Available</h2>
            <p className="text-gray-500">Conference photos will be displayed here once they are uploaded.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {galleries.map((gallery) => (
              <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Gallery Header */}
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{gallery.title}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>📅 {new Date(gallery.conferenceDate).toLocaleDateString()}</span>
                    <span>📍 {gallery.location}</span>
                  </div>
                </div>

                {/* Photo Grid */}
                {gallery.galleryImages && gallery.galleryImages.length > 0 && (
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(image.asset?.url || '')}
                        >
                          {image.asset?.url && (
                            <Image
                              src={image.asset.url}
                              alt={image.alt || `Gallery image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <Image
              src={selectedImage}
              alt="Gallery image"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PastConferenceGalleryPage;
