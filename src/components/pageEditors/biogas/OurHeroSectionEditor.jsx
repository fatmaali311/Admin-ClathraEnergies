import React from 'react';
import Card from '../../ui/Card';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';
import LocalizedInput from '../../ui/LocalizedInput';
import LocalizedTextArea from '../../ui/LocalizedTextArea';


const OurHeroSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleInputChange,
        handleFileChange,
    } = form;

    const activeCardClass = activeSection === 'hero-section' ? `ring-4 ring-opacity-50` : '';

    return (
        <Card title="Biogas Hero" color={PRIMARY_COLOR} id="hero-section" className={activeCardClass}>
            <MediaUpload
                title="Hero Background / Center Image"
                name="biogas_hero_image"
                fileState={newFiles.biogas_hero_image}
                url={getAdminImageUrl(imageUrls?.biogas_hero_image)}
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

export default OurHeroSectionEditor;
