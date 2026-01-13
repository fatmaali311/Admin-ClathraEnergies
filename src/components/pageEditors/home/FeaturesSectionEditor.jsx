import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import FeatureItemEditor from '../FeatureItemEditor';
import LocalizedInput from '../../ui/LocalizedInput';

const FeaturesSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleFileChange,
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
        handleInputChange, // Added
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
            <div className="pt-4">
                <Button
                    type="button"
                    onClick={() => handleAddItem('features_section', { title: { en: 'New Feature', fr: '', zh: '' }, sub_title: { en: 'Description here', fr: '', zh: '' } })}
                    className="w-full py-2.5 text-white font-semibold rounded-xl shadow-md hover:brightness-105 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #8CB190)` }}
                >
                    <span className="text-lg">+</span> Add New Feature Item
                </Button>
            </div>
            {/* Services Section Title */}
            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 rounded-full" style={{ backgroundColor: PRIMARY_COLOR }}></span>
                    Services Section Settings
                </h4>
                <LocalizedInput
                    label="Services Section Title"
                    name="services_section_title"
                    value={pageData.services_section_title}
                    onChange={handleInputChange}
                />
            </div>
        </Card>
    );
};
export default FeaturesSectionEditor;