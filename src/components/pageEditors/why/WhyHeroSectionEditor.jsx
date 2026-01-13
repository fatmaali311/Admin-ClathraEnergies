import React from 'react';
import Card from '../../ui/Card';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';
import LocalizedInput from '../../ui/LocalizedInput';
import LocalizedTextArea from '../../ui/LocalizedTextArea';

const WhyHeroSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleInputChange,
        handleFileChange,
    } = form;

    const activeCardClass = activeSection === 'hero-section' ? `ring-4 ring-opacity-50` : '';

    return (
        <Card title="Why Tech Hero" color={PRIMARY_COLOR} id="hero-section" className={activeCardClass}>
            <MediaUpload
                title="Hero Background Image"
                name="why_hero_image"
                fileState={newFiles.why_hero_image}
                url={getAdminImageUrl(imageUrls.why_hero_image)}
                handleFileChange={handleFileChange}
                accept="image/*"
            />

            <div className="space-y-6 mt-6">
                <LocalizedInput
                    label="Hero Title"
                    name="hero_section.title"
                    value={pageData.hero_section?.title}
                    onChange={handleInputChange}
                />
                <LocalizedTextArea
                    label="Hero Subtitle"
                    name="hero_section.sub_title"
                    value={pageData.hero_section?.sub_title}
                    onChange={handleInputChange}
                />
            </div>

        </Card>
    );
};

export default WhyHeroSectionEditor;
