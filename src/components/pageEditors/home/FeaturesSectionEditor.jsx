import React from 'react';
import Card from '../../ui/Card'; 
import Button from '../../ui/Button'; 
import FeatureItemEditor from '../FeatureItemEditor'; 

const FeaturesSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const { 
        pageData, 
        imageUrls, 
        newFiles, 
        handleFileChange, 
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
    } = form;
    
    const activeCardClass = activeSection === 'features-section' ? `ring-4 ring-opacity-50` : '';

    return (
        <Card 
            title="Features Section (Dynamic List)" 
            color={PRIMARY_COLOR} 
            id="features-section"
            className={activeCardClass}
        >
            <p className="text-sm text-gray-600 mb-4">You can add, edit, or remove any feature item below. (Icons will be named: home_feature_icon1, home_feature_icon2, etc.)</p>
            <div className="space-y-6">
                {(pageData.features_section || []).map((feature, index) => (
                    <FeatureItemEditor
                        key={index}
                        index={index}
                        feature={feature}
                        basePath="features_section"
                        imageName={`home_feature_icon${index + 1}`} 
                        imageUrls={imageUrls}
                        newFiles={newFiles}
                        onChange={handleArrayItemChange}
                        onFileChange={handleFileChange}
                        onRemove={handleRemoveItem}
                    />
                ))}
            </div>
            <Button 
                type="button"
                onClick={() => handleAddItem('features_section', { title: 'New Feature', sub_title: 'Description here' })}
                className="mt-6 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
            >
                + Add New Feature Item
            </Button>
        </Card>
    );
};
export default FeaturesSectionEditor;