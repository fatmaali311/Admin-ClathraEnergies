import React from 'react';
import Card from '../../ui/Card';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';
import LinkEditor from '../LinkEditor';
import LocalizedInput from '../../ui/LocalizedInput';
import LocalizedTextArea from '../../ui/LocalizedTextArea';

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
                url={getAdminImageUrl(imageUrls.home_about_image)}
                handleFileChange={handleFileChange}
                accept="image/*"
            />
            <div className="mt-6 space-y-6">
                <LocalizedInput
                    label="Title"
                    name="who_we_are_section.title"
                    value={pageData.who_we_are_section?.title}
                    onChange={handleInputChange}
                />
                <LocalizedTextArea
                    label="Paragraph / Subtitle"
                    name="who_we_are_section.sub_title"
                    value={pageData.who_we_are_section?.sub_title}
                    onChange={handleInputChange}
                />

                {/* Locations */}
                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-4">Location Labels (Map Points)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                            const defaultLocations = [
                                { label: { en: 'France', fr: 'France', zh: '法国' } },
                                { label: { en: 'Egypt', fr: 'Égypte', zh: '埃及' } },
                                { label: { en: 'China', fr: 'Chine', zh: '中国' } },
                            ];
                            const locations = (pageData.who_we_are_section?.locations && pageData.who_we_are_section.locations.length > 0)
                                ? pageData.who_we_are_section.locations
                                : defaultLocations;

                            return locations.map((loc, index) => (
                                <LocalizedInput
                                    key={index}
                                    label={`Location ${index + 1}`}
                                    name={`loc_${index}`}
                                    value={loc.label}
                                    onChange={(e) => {
                                        // Use current 'locations' (which might be defaults) as base
                                        const newLocations = [...locations];
                                        newLocations[index] = { ...newLocations[index], label: e.target.value };
                                        handleInputChange({ target: { name: 'who_we_are_section.locations', value: newLocations } });
                                    }}
                                />
                            ));
                        })()}
                    </div>
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