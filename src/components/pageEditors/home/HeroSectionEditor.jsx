// src/components/pageEditors/home/HeroSectionEditor.jsx
import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import MediaUpload from '../../ui/MediaUpload';
import Button from '../../ui/Button';
import LinkEditor from '../LinkEditor';

const HeroSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleInputChange,
        handleFileChange,
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
    } = form;

    const activeCardClass = activeSection === 'hero-section' ? `ring-4 ring-opacity-50` : '';

    return (
        <Card
            title="Home Hero Section"
            color={PRIMARY_COLOR}
            id="hero-section"
            className={activeCardClass}
        >
            <MediaUpload
                title="Hero Background Image"
                name="home_hero_image"
                fileState={newFiles.home_hero_image}
                url={imageUrls.home_hero_image}
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
                    title="Hero Subtitle/Small Text"
                    name="hero_section.sub_title"
                    value={pageData.hero_section?.sub_title || ''}
                    onChange={handleInputChange}
                />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4 border-t pt-4">Call-to-Action Buttons (Dynamic)</h3>
            <div className="space-y-4">
                {(pageData.hero_section?.buttons || []).map((button, index) => (
                    <LinkEditor
                        key={index}
                        index={index}
                        linkObj={button}
                        basePath="hero_section.buttons"
                        onChange={handleArrayItemChange}
                        onRemove={handleRemoveItem}
                        allowRemoval={true}
                    />

                ))}
            </div>
            <Button
                type="button"
                onClick={() => handleAddItem('hero_section.buttons', { name: 'New Button', link: '/' })}
                className="mt-6 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
            >
                + Add New Button
            </Button>
        </Card>
    );
};
export default HeroSectionEditor;