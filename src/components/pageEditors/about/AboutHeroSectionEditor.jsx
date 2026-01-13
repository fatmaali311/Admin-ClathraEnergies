import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import LocalizedInput from '../../ui/LocalizedInput';
import LocalizedTextArea from '../../ui/LocalizedTextArea';
import { getAdminImageUrl } from '../../../lib/mediaUtils';

const AboutHeroSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleInputChange,
        handleFileChange,
    } = form;

    const activeCardClass = activeSection === 'hero-section' ? `ring-4 ring-opacity-50 ring-${PRIMARY_COLOR.replace('#', '')}/50` : '';

    return (
        <Card
            title="Hero Section"
            color={PRIMARY_COLOR}
            id="hero-section"
            className={activeCardClass}
        >
            <MediaUpload
                title="Hero Background Image"
                name="about_hero_image"
                fileState={newFiles.about_hero_image}
                url={getAdminImageUrl(imageUrls.about_hero_image)}
                handleFileChange={handleFileChange}
                accept="image/*"
            />
            <LocalizedInput
                label="Title"
                name="hero_section.title"
                value={pageData.hero_section?.title}
                onChange={handleInputChange}
                className="mt-6"
            />
            <LocalizedTextArea
                label="Subtitle / Summary"
                name="hero_section.sub_title"
                value={pageData.hero_section?.sub_title}
                onChange={handleInputChange}
                rows={4}
            />
        </Card>
    );
};
export default AboutHeroSectionEditor;
