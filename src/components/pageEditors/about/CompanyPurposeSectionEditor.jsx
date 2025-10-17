import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import Button from '../../ui/Button';
import DetailItemEditor from './DetailItemEditor';

const CompanyPurposeSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
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

  const detailsPath = 'company_purpose.company_details';
  const details = pageData.company_purpose?.company_details || [];

  const isActive = activeSection === 'company-purpose';

  return (
    <Card
      title="Company Purpose & Details"
      id="company-purpose"
      className={`transition-all duration-300 ${
        isActive ? 'ring-4 ring-opacity-50' : ''
      }`}
      style={{
        '--tw-ring-color': PRIMARY_COLOR,
      }}
    >
      {/* Main Title */}
      <InputGroup
        title="Main Title"
        name="company_purpose.title"
        value={pageData.company_purpose?.title || ''}
        onChange={handleInputChange}
      />

      {/* Subtitle */}
      <div className="mt-4">
        <label className="block text-md font-semibold text-gray-700 mb-1">
          Main Subtitle / Paragraph
        </label>
        <textarea
          name="company_purpose.sub_title"
          value={pageData.company_purpose?.sub_title || ''}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--tw-ring-color)] text-base"
        />
      </div>

      {/* Company Details */}
      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-t pt-4">
        Company Details List
      </h3>
      <div className="space-y-6">
        {details.map((item, index) => (
          <DetailItemEditor
            key={index}
            index={index}
            item={item}
            basePath={detailsPath}
            imageName={`about_detail_icon_${index + 1}`}
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
        onClick={() =>
          handleAddItem(detailsPath, {
            title: 'New Detail',
            sub_title: 'Explain the detail here.',
            bg_color: '#F0F4F8',
          })
        }
        className="mt-6 bg-[var(--tw-ring-color)] hover:opacity-90 text-white font-semibold py-2 rounded-xl w-full transition-all duration-200"
      >
        + Add New Company Detail
      </Button>
    </Card>
  );
};

export default CompanyPurposeSectionEditor;
