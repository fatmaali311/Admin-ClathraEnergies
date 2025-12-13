import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';

const GasSeparationSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleInputChange,
        handleFileChange,
        handleArrayItemChange,
    } = form;

    const activeCardClass = activeSection === 'gas-separation' ? `ring-4 ring-opacity-50` : '';

    const gasSection = pageData.gas_separation || { gases: [] };

    return (
        <Card title="Gas Separation" color={PRIMARY_COLOR} id="gas-separation" className={activeCardClass}>

            <div className="grid grid-cols-1 gap-4">
                <InputGroup
                    title="Section Title"
                    name="gas_separation.title"
                    value={gasSection.title || ''}
                    onChange={handleInputChange}
                />

                <InputGroup
                    title="Section Subtitle"
                    name="gas_separation.sub_title"
                    value={gasSection.sub_title || ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Background image + gradient opacity */}
            <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Background Image (Arrow area)</h4>
                <MediaUpload
                    title="Background Image"
                    name="gas_bg_image"
                    fileState={newFiles?.gas_bg_image}
                    url={getAdminImageUrl(imageUrls?.gas_bg_image)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />

                <div className="mt-3 grid gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Darkness Opacity</label>
                        <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <input
                                type="range"
                                name="gas_separation.bg_dark_opacity"
                                min="0"
                                max="1"
                                step="0.05"
                                value={gasSection.bg_dark_opacity ?? 0.5}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: PRIMARY_COLOR }}
                                title="Drag to change dark overlay opacity"
                            />
                            <input
                                type="number"
                                name="gas_separation.bg_dark_opacity"
                                min="0"
                                max="1"
                                step="0.05"
                                value={gasSection.bg_dark_opacity ?? 0.5}
                                onChange={handleInputChange}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">0.0 (no darkness) to 1.0 (full dark overlay).</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lightness Opacity</label>
                        <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <input
                                type="range"
                                name="gas_separation.bg_light_opacity"
                                min="0"
                                max="1"
                                step="0.05"
                                value={gasSection.bg_light_opacity ?? 0.2}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: PRIMARY_COLOR }}
                                title="Drag to change light overlay opacity"
                            />
                            <input
                                type="number"
                                name="gas_separation.bg_light_opacity"
                                min="0"
                                max="1"
                                step="0.05"
                                value={gasSection.bg_light_opacity ?? 0.2}
                                onChange={handleInputChange}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">0.0 (no light) to 1.0 (full white overlay).</p>
                    </div>
                </div>
            </div>

            {/* Floating Icons (fire, ice, leaf) - show right after subtitle */}
            <div className="mt-6 pt-2">
                <h4 className="text-lg font-semibold mb-3">Floating Icons (Fire / Ice / Leaf)</h4>
                <p className="text-gray-600 mb-4">Upload the three floating icons displayed above the arrow on the public page.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Fire Icon</h5>
                        <MediaUpload
                            title="Fire Icon"
                            name="floating_fire_image"
                            fileState={newFiles?.floating_fire_image}
                            url={getAdminImageUrl(imageUrls?.floating_fire_image)}
                            handleFileChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Ice Icon</h5>
                        <MediaUpload
                            title="Ice Icon"
                            name="floating_ice_image"
                            fileState={newFiles?.floating_ice_image}
                            url={getAdminImageUrl(imageUrls?.floating_ice_image)}
                            handleFileChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Leaf Icon</h5>
                        <MediaUpload
                            title="Leaf Icon"
                            name="floating_leaf_image"
                            fileState={newFiles?.floating_leaf_image}
                            url={getAdminImageUrl(imageUrls?.floating_leaf_image)}
                            handleFileChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

            {/* Learn More / Button settings (placed after floating icons) */}
            <div className="mt-8">
                <h4 className="text-md font-semibold mb-2">Button</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup
                        title="Button Title"
                        name="gas_separation.button.title"
                        value={(gasSection.button && gasSection.button.title) || ''}
                        onChange={handleInputChange}
                    />

                    <InputGroup
                        title="Button Link"
                        name="gas_separation.button.link"
                        value={(gasSection.button && gasSection.button.link) || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">If the link starts with '/', it will open in the same tab; otherwise it opens in a new tab.</p>
            </div>

            <p className="text-gray-600 mt-6 mb-4">Edit the three main gases (name, color, image).</p>

            <div className="space-y-6">
                {(gasSection.gases || []).map((g, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Gas Name</label>
                                <input
                                    type="text"
                                    name={`gas_separation.gases.${index}.name`}
                                    value={g.name || ''}
                                    onChange={(e) => handleArrayItemChange('gas_separation.gases', index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={g.color || '#ffffff'}
                                        onChange={(e) => handleArrayItemChange('gas_separation.gases', index, 'color', e.target.value)}
                                        className="w-16 h-10 p-0 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={g.color || '#ffffff'}
                                        onChange={(e) => handleArrayItemChange('gas_separation.gases', index, 'color', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                                <MediaUpload
                                    title={`Gas ${index + 1} Image`}
                                    name={`gases[${index}]`}
                                    fileState={newFiles[`gases[${index}]`]}
                                    url={getAdminImageUrl(imageUrls?.[`gases[${index}]`])}
                                    handleFileChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

  

        </Card>
    );
};

export default GasSeparationSectionEditor;
