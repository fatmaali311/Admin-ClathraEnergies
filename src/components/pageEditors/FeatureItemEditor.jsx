// src/components/pageEditors/FeatureItemEditor.jsx
import React from 'react';
import InputGroup from '../../components/ui/InputGroup';
import MediaUpload from '../../components/ui/MediaUpload'; 
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card'; 

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
    return (
        <Card title={`Feature #${index + 1}`} color="#1976D2">
            <div className="space-y-4">
                <InputGroup 
                    title="Feature Title" 
                    value={feature.title || ''} 
                    onChange={(e) => onChange(basePath, index, 'title', e.target.value)}
                />
                <InputGroup 
                    title="Feature Subtitle/Description" 
                    value={feature.sub_title || ''} 
                    onChange={(e) => onChange(basePath, index, 'sub_title', e.target.value)}
                />
                
                <MediaUpload
                    title="Feature Icon"
                    name={imageName}
                    fileState={newFiles[imageName]}
                    url={imageUrls[imageName]}
                    handleFileChange={onFileChange}
                    accept="image/*"
                />

                <div className="flex justify-end pt-2">
                    <Button 
                        type="button" 
                        onClick={() => onRemove(basePath, index)}
                        className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    >
                        Remove Feature
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default FeatureItemEditor;