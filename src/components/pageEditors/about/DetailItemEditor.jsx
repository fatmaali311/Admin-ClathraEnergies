import React from 'react';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import Button from '../../ui/Button';

const DetailItemEditor = ({
    index,
    item,
    basePath,
    imageName,
    imageUrls,
    newFiles,
    onChange,
    onFileChange,
    onRemove
}) => {
    const itemPath = basePath;


    const handleInput = (e) => {
  onChange(basePath, index, e.target.name.split('.').pop(), e.target.value);
};


    return (
        <div className="border border-gray-200 p-4 rounded-xl space-y-4 bg-gray-50">
            <h4 className="text-lg font-bold text-gray-800 border-b pb-2">Detail Item #{index + 1}</h4>

            {/* Image Upload */}
            <MediaUpload
                title="Icon Image"
                name={imageName}
                fileState={newFiles[imageName]}
                url={imageUrls[imageName]}
                handleFileChange={onFileChange}
                accept="image/*"
            />

            {/* Title */}
            <InputGroup
                title="Title"
                name="title"
                value={item.title || ''}
                onChange={handleInput}
            />

            {/* Subtitle */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description / Subtitle
                </label>
                <textarea
                    name="sub_title"
                    value={item.sub_title || ''}
                    onChange={handleInput}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ADD0B3] focus:border-[#ADD0B3] text-base"
                />
            </div>

            {/* Color Picker + Text Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Background Color (Hex Code)
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="color"
                        name="bg_color"
                        value={item.bg_color || '#FFFFFF'}
                        onChange={handleInput}
                        className="w-12 h-10 p-0 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                        type="text"
                        name="bg_color"
                        value={item.bg_color || '#FFFFFF'}
                        onChange={handleInput}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ADD0B3] focus:border-[#ADD0B3]"
                        placeholder="#FFFFFF"
                    />
                </div>
            </div>

            {/* Remove Button */}
            {onRemove && (
                <Button
                    type="button"
                    onClick={() => onRemove(basePath, index)}
                    className="bg-red-500 hover:bg-red-600 focus:ring-red-400 w-full"
                >
                    Remove Item
                </Button>
            )}
        </div>
    );
};

export default DetailItemEditor;
