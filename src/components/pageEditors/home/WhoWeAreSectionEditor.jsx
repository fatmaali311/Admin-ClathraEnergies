// src/components/pageEditors/home/WhoWeAreSectionEditor.jsx
import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import LinkEditor from '../LinkEditor';

const WhoWeAreSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleInputChange,
        handleFileChange,
    } = form;

    const activeCardClass = activeSection === 'who-we-are-section' ? `ring-4 ring-opacity-50` : '';

    return (
        <Card
            title="Who We Are Section"
            color={PRIMARY_COLOR}
            id="who-we-are-section"
            className={activeCardClass}
        >
            <MediaUpload
                title="Who We Are Image"
                name="home_about_image"
                fileState={newFiles.home_about_image}
                url={imageUrls.home_about_image}
                handleFileChange={handleFileChange}
                accept="image/*"
            />
            <div className="mt-6 space-y-6">
                <InputGroup
                    title="Title"
                    name="who_we_are_section.title"
                    value={pageData.who_we_are_section?.title || ''}
                    onChange={handleInputChange}
                />
                {/* Paragraph / subtitle - required */}
                <div>
                    <label className="block text-md font-semibold text-gray-700 mb-1">Paragraph / Subtitle</label>
                    <textarea
                        name="who_we_are_section.sub_title"
                        value={pageData.who_we_are_section?.sub_title || ''}
                        onChange={handleInputChange}
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-600 focus:border-blue-600 text-lg"
                    />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3 border-t pt-4">Read More Button (Single)</h3>
            <LinkEditor
                linkObj={pageData.who_we_are_section?.button || {}}
                basePath="who_we_are_section.button"
                onChange={handleInputChange}
                allowRemoval={false}
            />


        </Card>
    );
};
export default WhoWeAreSectionEditor;