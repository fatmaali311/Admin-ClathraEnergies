import React from 'react';
import MediaUpload from '../ui/MediaUpload';

const MediaUploadSection = ({ config, fileState, handleFileChange, PRIMARY_COLOR }) => {
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
        url={config.mediaUrls.mainLogoUrl}
        handleFileChange={handleFileChange}
      />

      {/* Secondary Logo */}
      <MediaUpload
        title="Secondary Logo"
        name="secondaryLogo"
        fileState={fileState.secondaryLogo}
        url={config.mediaUrls.secondaryLogoUrl}
        handleFileChange={handleFileChange}
      />

      {/* Main Video */}
      <MediaUpload
        title="Main Video"
        name="mainVideo"
        fileState={fileState.mainVideo}
        url={config.mediaUrls.mainVideoUrl}
        handleFileChange={handleFileChange}
        accept="video/*"
        isVideo
      />
    </div>
  );
};

export default MediaUploadSection;
