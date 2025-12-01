import React from 'react';
import Card from '../../ui/Card'; 
import InputGroup from '../../ui/InputGroup'; 
import MediaUpload from '../../ui/MediaUpload'; 
import { getAdminImageUrl } from '../../../lib/mediaUtils';
import LinkEditor from '../LinkEditor'; 

const CtaSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const { 
        pageData, 
        imageUrls, 
        newFiles, 
        handleInputChange, 
        handleFileChange,
    } = form;
    
    const activeCardClass = activeSection === 'cta-section' ? `ring-4 ring-opacity-50` : '';

    return (
        <Card 
            title="Call to Action Section" 
            color={PRIMARY_COLOR} 
            id="cta-section"
            className={activeCardClass}
        >
            <MediaUpload
                title="CTA Background Image"
                name="home_cta_image"
                fileState={newFiles.home_cta_image}
                url={getAdminImageUrl(imageUrls.home_cta_image)}
                handleFileChange={handleFileChange}
                accept="image/*"
            />
            <InputGroup 
                title="CTA Title" 
                name="cta_section.title" 
                value={pageData.cta_section?.title || ''} 
                onChange={handleInputChange} 
                className="mt-6"
            />
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3 border-t pt-4">CTA Button (Single)</h3>
            <LinkEditor 
                linkObj={pageData.cta_section?.button || {}}

                basePath="cta_section.button"
                onChange={handleInputChange} 
                allowRemoval={false}
            />
        </Card>
    );
};
export default CtaSectionEditor;