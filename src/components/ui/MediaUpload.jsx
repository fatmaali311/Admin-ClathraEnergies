import React, { useEffect, useState } from 'react';

/**
 * Reusable component for file input (Image/Video) with preview and placeholder icon.
 * This component is general and can be used for single media fields or media within arrays.
 * * Props:
 * - title: Display name (e.g., "Main Logo")
 * - name: Field name used as the key in newFiles and imageUrls state (e.g., "mainLogo", "home_feature_icon1")
 * - fileState: The File object for the newly selected file (from newFiles[name]).
 * - url: The URL for the existing file (from imageUrls[name]).
 * - handleFileChange: The handler function from useConfigForm or usePageForm (which takes the event).
 * - accept: File types string (e.g., 'image/*', 'video/*').
 * - isVideo: Boolean flag to show video-specific UI.
 */
const MediaUpload = ({ 
    title, 
    name, 
    fileState, 
    url, 
    handleFileChange, 
    accept = 'image/*', 
    isVideo = false 
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    // Generate preview URL for newly selected image files
    useEffect(() => {
        if (fileState instanceof File && !isVideo) {
            // Create a temporary object URL for local preview
            const objectUrl = URL.createObjectURL(fileState);
            setPreviewUrl(objectUrl);
            
            // Cleanup: Revoke the object URL when component unmounts or file changes
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [fileState, isVideo]);

    // If a new file is selected, use its preview URL; otherwise, use the existing URL.
    const displayUrl = isVideo ? url : (previewUrl || url);

    // The clean SVG Path for a video camera or an image gallery.
    const SVG_PATH = {
        video: "M15 10l4.555-4.555A.75.75 0 0121 6v12a.75.75 0 01-1.445.445L15 14M2 12a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v4z",
        image: "M3 17v-4a3 3 0 013-3h12a3 3 0 013 3v4M3 17h18M12 9v11M12 9l-4-4M12 9l4-4"
    };

    return (
        <div className="space-y-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
            <label className="block text-md font-semibold text-gray-700">{title}</label>

            {/* Preview Area */}
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {(displayUrl) ? (
                    isVideo ? (
                        <video 
                            src={displayUrl} 
                            controls 
                            className="max-h-full w-auto object-contain"
                            title={`Video Preview for ${title}`}
                        />
                    ) : (
                        <img 
                            src={displayUrl} 
                            alt={`Preview of ${title}`} 
                            className="max-h-full w-auto object-contain" 
                        />
                    )
                ) : (
                    // Placeholder Icon
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d={isVideo ? SVG_PATH.video : SVG_PATH.image}
                            />
                        </svg>
                        <p className="mt-1 text-sm">No {title.toLowerCase()} uploaded yet.</p>
                    </div>
                )}
            </div>

            {/* File Input */}
            <input
                type="file"
                name={name}
                accept={accept}
                onChange={(e) => {
                    handleFileChange(e);
                }}
                className="w-full text-base text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
            />
            
            {/* Display status of new file selection */}
            {fileState && (
                <p className={`text-sm mt-2 font-medium ${fileState.size > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    New file ready: **{fileState.name}** {isVideo && <span className="text-blue-600 ml-2">(Video will replace existing file on save)</span>}
                </p>
            )}
        </div>
    );
};

export default MediaUpload;
