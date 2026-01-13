import React from 'react';
import Card from '../../ui/Card';
import MediaUpload from '../../ui/MediaUpload';
import Button from '../../ui/Button';
import { getAdminImageUrl } from '../../../lib/mediaUtils';
import LocalizedInput from '../../ui/LocalizedInput';

const PartnersSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
  const {
    pageData,
    imageUrls,
    newFiles,
    handleFileChange,
    handleAddItem,
    handleRemoveItem,
    handleInputChange, // Added
  } = form;

  const sectionId = 'partners-section';
  const activeCardClass = activeSection === sectionId ? `ring-4 ring-opacity-50` : '';

  const partners = pageData.partners_section || [];

  return (
    <Card
      id={sectionId}
      title="Partners Section (Logos)"
      color={PRIMARY_COLOR}
      className={activeCardClass}
    >
      <div className="mb-6">
        <LocalizedInput
          label="Section Title"
          name="partners_section_title"
          value={pageData.partners_section_title}
          onChange={handleInputChange}
        />
      </div>

      <p className="text-gray-600 mb-4">
        Upload logos for your partners. These will be displayed on the homepage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((_, index) => (
          <div key={index} className="relative group">
            <MediaUpload
              title={`Partner Logo ${index + 1}`}
              name={`partners_section[${index}]`}
              fileState={newFiles[`partners_section[${index}]`]}
              url={getAdminImageUrl(imageUrls[`partners_section[${index}]`])}
              handleFileChange={handleFileChange}
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem('partners_section', index)}
              className="absolute top-6 right-6 p-2 bg-white text-red-500 rounded-full shadow-md border border-red-100 hover:bg-red-50 hover:text-red-700 transition-all duration-300 z-10"
              title="Remove Logo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <Button
          type="button"
          onClick={() => handleAddItem('partners_section', {})}
          className="w-full py-2.5 text-white font-semibold rounded-xl shadow-md hover:brightness-105 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #8CB190)` }}
        >
          <span className="text-lg">+</span> Add New Partner Logo
        </Button>
      </div>
    </Card>
  );
};

export default PartnersSectionEditor;
