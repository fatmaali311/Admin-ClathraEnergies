import React from 'react';
import Card from '../../ui/Card';
import MediaUpload from '../../ui/MediaUpload';
import Button from '../../ui/Button';
import { getAdminImageUrl } from '../../../lib/mediaUtils';

const PartnersSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
  const {
    pageData,
    imageUrls,
    newFiles,
    handleFileChange,
    handleAddItem,
    handleRemoveItem,
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
      <p className="text-gray-600 mb-4">
        Upload logos for your partners. These will be displayed on the homepage.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((_, index) => (
          <div key={index} className="relative">
            <MediaUpload
              title={`Partner Logo ${index + 1}`}
              name={`partners_section[${index}]`}
              fileState={newFiles[`partners_section[${index}]`]}
              url={getAdminImageUrl(imageUrls[`partners_section[${index}]`])}
              handleFileChange={handleFileChange}
              accept="image/*"
            />
            <Button
              type="button"
              onClick={() => handleRemoveItem('partners_section', index)}
              className="absolute top-2 right-2 bg-red-500 text-white text-sm px-3 py-1 rounded-xl hover:bg-red-600"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={() => handleAddItem('partners_section', {})}
        className="mt-6 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
      >
        + Add New Partner Logo
      </Button>
    </Card>
  );
};

export default PartnersSectionEditor;
