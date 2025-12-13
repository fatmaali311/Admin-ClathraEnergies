import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';


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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InputGroup
                    title="Hero Title"
                    name="hero_section.title"
                    value={pageData.hero_section?.title || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Hero Subtitle"
                    name="hero_section.sub_title"
                    value={pageData.hero_section?.sub_title || ''}
                    onChange={handleInputChange}
                />
            </div>

        </Card>
    );
};

export default OurHeroSectionEditor;
