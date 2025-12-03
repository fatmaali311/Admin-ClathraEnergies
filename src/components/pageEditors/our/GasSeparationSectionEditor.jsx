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
