import React from 'react';
import Card from '../../ui/Card';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';
import LocalizedTextArea from '../../ui/LocalizedTextArea';

const OurStepsSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleFileChange,
        handleArrayItemChange,
    } = form;

    const activeCardClass = activeSection === 'steps-section' ? `ring-4 ring-opacity-50` : '';

    // Always show exactly 6 steps for the Our page
    const steps = pageData.steps || [];

    return (
        <Card title="Cycle Steps" color={PRIMARY_COLOR} id="steps-section" className={activeCardClass}>
            <p className="text-gray-600 mb-6">Edit the 6 biogas cycle steps and their images. Each step is permanent.</p>

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
                <h4 className="font-semibold text-gray-800">Steps ({steps.length})</h4>
            </div>

            {/* Steps List */}
            <div className="space-y-6 mb-6">
                {steps.map((step, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        {/* Step Header with ID */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#ADD0B3] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                {step.id || index + 1}
                            </div>
                            <h5 className="font-semibold text-gray-700">Step {index + 1}</h5>
                        </div>

                        {/* Step Text Area */}
                        <div className="mb-4">
                            <LocalizedTextArea
                                label="Step Text"
                                name="text"
                                value={step.text}
                                onChange={(e) => handleArrayItemChange('steps', index, 'text', e.target.value)}
                            />
                        </div>

                        {/* Step Image Upload */}
                        <div>
                            <MediaUpload
                                title="Step Image"
                                name={`steps[${index}]`}
                                fileState={newFiles[`steps[${index}]`]}
                                url={getAdminImageUrl(imageUrls[`steps[${index}]`])}
                                handleFileChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </div>
                ))}
            </div>

        </Card>
    );
};

export default OurStepsSectionEditor;
