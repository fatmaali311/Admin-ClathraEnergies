import React from 'react';
import LocalizedInput from '../ui/LocalizedInput';
import LocalizedTextArea from '../ui/LocalizedTextArea';
import Card from '../ui/Card';
import MediaUpload from '../ui/MediaUpload';
import Button from '../ui/Button';
import { getAdminImageUrl } from '../../lib/mediaUtils';

const FeatureItemEditor = ({
    index,
    feature,
    basePath,
    imageName,
    imageUrls,
    newFiles,
    onChange,
    onFileChange,
    onRemove
}) => {
    // Adapter for LocalizedInput's onChange -> parent's handleArrayItemChange
    const handleLocalChange = (field, e) => {
        onChange(basePath, index, field, e.target.value);
    };

    return (
        <Card title={`Feature #${index + 1}`} color="#1976D2">
            <div className="space-y-4">
                <LocalizedInput
                    label="Feature Title"
                    name="title"
                    value={feature.title}
                    onChange={(e) => handleLocalChange('title', e)}
                />
                <LocalizedTextArea
                    label="Feature Subtitle/Description"
                    name="sub_title"
                    value={feature.sub_title}
                    onChange={(e) => handleLocalChange('sub_title', e)}
                />

                <MediaUpload
                    title="Feature Icon"
                    name={imageName}
                    fileState={newFiles[imageName]}
                    url={getAdminImageUrl(imageUrls[imageName])}
                    handleFileChange={onFileChange}
                    accept="image/*"
                />

                <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
                    <button
                        type="button"
                        onClick={() => onRemove(basePath, index)}
                        className="px-4 py-1.5 rounded-lg bg-white text-red-500 font-medium hover:bg-red-50 transition-all duration-300 border border-red-200 flex items-center gap-1.5 text-sm"
                    >
                        <span>×</span> Remove Feature
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default FeatureItemEditor;