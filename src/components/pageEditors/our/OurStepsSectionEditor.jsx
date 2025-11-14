import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import Button from '../../ui/Button';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';

const OurStepsSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleFileChange,
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
    } = form;

    const activeCardClass = activeSection === 'steps-section' ? `ring-4 ring-opacity-50` : '';

    const steps = pageData.steps || [];
    const maxSteps = 6;
    const canAddMore = steps.length < maxSteps;

    return (
        <Card title="Cycle Steps" color={PRIMARY_COLOR} id="steps-section" className={activeCardClass}>
            <p className="text-gray-600 mb-6">Edit the biogas cycle steps. Maximum {maxSteps} steps allowed.</p>

            {/* Media Upload */}
            <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-3">Cycle Diagram Image</h4>
                <MediaUpload
                    title=""
                    name="our_circle_image"
                    fileState={newFiles?.our_circle_image}
                    url={getAdminImageUrl(imageUrls?.our_circle_image)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
            </div>

            {/* Steps Counter */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Steps</h4>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {steps.length}/{maxSteps}
                </span>
            </div>

            {/* Steps List */}
            <div className="space-y-3 mb-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-8 h-8 rounded-full bg-[#ADD0B3] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                            {step.id || index + 1}
                        </div>
                        <div className="flex-1">
                            <textarea
                                name={`steps.${index}.text`}
                                value={step.text || ''}
                                onChange={(e) => handleArrayItemChange('steps', index, 'text', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ADD0B3] resize-none"
                                rows="2"
                                placeholder="Enter step text..."
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveItem('steps', index)}
                            className="flex-shrink-0 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-medium transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                type="button"
                onClick={() => handleAddItem('steps', { id: (steps.length || 0) + 1, text: '' })}
                disabled={!canAddMore}
                className={`w-full py-2 px-4 rounded font-semibold text-sm transition-all ${
                    canAddMore
                        ? 'bg-[#ADD0B3] hover:bg-[#388E3C] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                {canAddMore ? '+ Add Step' : `Max ${maxSteps} Steps`}
            </button>
        </Card>
    );
};

export default OurStepsSectionEditor;
