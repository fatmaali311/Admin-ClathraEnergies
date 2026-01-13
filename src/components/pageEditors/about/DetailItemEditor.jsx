import React from 'react';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import LocalizedInput from '../../ui/LocalizedInput';
import LocalizedTextArea from '../../ui/LocalizedTextArea';
import { getAdminImageUrl } from '../../../lib/mediaUtils';
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
    const handleInput = (e) => {
        onChange(basePath, index, e.target.name.split('.').pop(), e.target.value);
    };


    return (
        <div className="border border-gray-200 p-4 rounded-xl space-y-4 bg-gray-50">
            <h4 className="text-lg font-bold text-gray-800 border-b pb-2">Detail Item #{index + 1}</h4>

            {/* Image Upload: skip for objectives (no icons needed) */}
            {!(basePath === 'our_strategic_objectives' || (imageName && imageName.startsWith('objective_icon_'))) && (
                <MediaUpload
                    title="Icon Image"
                    name={imageName}
                    fileState={newFiles[imageName]}
                    url={getAdminImageUrl(imageUrls[imageName])}
                    handleFileChange={onFileChange}
                    accept="image/*"
                />
            )}

            {/* Title */}
            <LocalizedInput
                label="Title"
                name="title"
                value={item.title}
                onChange={handleInput}
            />

            {/* Subtitle */}
            <LocalizedTextArea
                label="Description / Subtitle"
                name="sub_title"
                value={item.sub_title}
                onChange={handleInput}
                rows={3}
            />

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
                <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
                    <button
                        type="button"
                        onClick={() => onRemove(basePath, index)}
                        className="px-4 py-1.5 rounded-lg bg-white text-red-500 font-medium hover:bg-red-50 transition-all duration-300 border border-red-200 flex items-center gap-1.5 text-sm"
                    >
                        <span>×</span> Remove Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default DetailItemEditor;
