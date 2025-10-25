import React from 'react';
import Card from '../../ui/Card'; 
import InputGroup from '../../ui/InputGroup'; 
import MediaUpload from '../../ui/MediaUpload'; 
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
            <InputGroup 
                title="Title" 
                name="hero_section.title" 
                value={pageData.hero_section?.title || ''} 
                onChange={handleInputChange} 
                className="mt-6"
            />
            <div>
                <label className="block text-md font-semibold text-gray-700 mb-1">Subtitle / Summary</label>
                <textarea
                    name="hero_section.sub_title" 
                    value={pageData.hero_section?.sub_title || ''} 
                    onChange={handleInputChange} 
                    rows="4" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-600 focus:border-blue-600 text-lg"
                />
            </div>
        </Card>
    );
};
export default AboutHeroSectionEditor;
