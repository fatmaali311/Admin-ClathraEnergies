import React, { useState, useMemo } from 'react';
import MediaUpload from '../ui/MediaUpload';
import { getAdminImageUrl } from '../../lib/mediaUtils';

const MediaUploadSection = ({ config, fileState, handleFileChange, PRIMARY_COLOR }) => {
  // Detect if current main media is video or image based on URL
  const currentMediaType = useMemo(() => {
    const videoUrl = config.mediaUrls?.mainVideoUrl || '';
    const imageUrl = config.mediaUrls?.mainImageUrl || '';
    
    // Check if either URL exists
    if (videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.mov') || videoUrl.includes('video'))) {
      return 'video';
    }
    if (imageUrl && (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png') || imageUrl.endsWith('.gif') || imageUrl.includes('image'))) {
      return 'image';
    }
    // Default to image if both exist or neither exists
    return 'image';
  }, [config.mediaUrls]);

  const [mainMediaType, setMainMediaType] = useState(currentMediaType);

  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-bold border-l-4 pl-3"
        style={{ borderLeftColor: PRIMARY_COLOR }}
      >
        Media Uploads
      </h2>

      {/* Main Logo */}
      <MediaUpload
        title="Main Logo"
        name="mainLogo"
        fileState={fileState.mainLogo}
        url={getAdminImageUrl(config.mediaUrls.mainLogoUrl)}
        handleFileChange={handleFileChange}
      />

      {/* Secondary Logo */}
      <MediaUpload
        title="Secondary Logo"
        name="secondaryLogo"
        fileState={fileState.secondaryLogo}
        url={getAdminImageUrl(config.mediaUrls.secondaryLogoUrl)}
        handleFileChange={handleFileChange}
      />

      {/* Main Media (Video or Image) */}
      <div className="space-y-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-md font-semibold text-gray-700">Main Media</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMainMediaType('image')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mainMediaType === 'image'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📷 Image
            </button>
            <button
              type="button"
              onClick={() => setMainMediaType('video')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mainMediaType === 'video'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎬 Video
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {mainMediaType === 'video'
            ? 'Upload a video file to be displayed on the homepage'
            : 'Upload an image file to be displayed on the homepage'}
        </p>
        <MediaUpload
          title={`Main ${mainMediaType === 'video' ? 'Video' : 'Image'}`}
          name="mainVideo"
          fileState={fileState.mainVideo}
          url={mainMediaType === 'video' ? getAdminImageUrl(config.mediaUrls.mainVideoUrl) : getAdminImageUrl(config.mediaUrls.mainImageUrl)}
          handleFileChange={handleFileChange}
          accept={mainMediaType === 'video' ? 'video/*' : 'image/*'}
          isVideo={mainMediaType === 'video'}
        />
      </div>
    </div>
  );
};

export default MediaUploadSection;
