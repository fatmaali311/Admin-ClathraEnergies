import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import Button from '../../ui/Button';
import LocalizedInput from '../../ui/LocalizedInput';
import LocalizedTextArea from '../../ui/LocalizedTextArea';
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
      className={`transition-all duration-300 ${isActive ? 'ring-4 ring-opacity-50' : ''
        }`}
      style={{
        '--tw-ring-color': PRIMARY_COLOR,
      }}
    >
      {/* Main Title */}
      <LocalizedInput
        label="Main Title"
        name="company_purpose.title"
        value={pageData.company_purpose?.title}
        onChange={handleInputChange}
      />

      {/* Subtitle */}
      <LocalizedTextArea
        label="Main Subtitle / Paragraph"
        name="company_purpose.sub_title"
        value={pageData.company_purpose?.sub_title}
        onChange={handleInputChange}
        rows={4}
      />

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

      <div className="pt-6">
        <Button
          type="button"
          onClick={() =>
            handleAddItem(detailsPath, {
              title: { en: 'New Detail', fr: '', zh: '' },
              sub_title: { en: 'Explain the detail here.', fr: '', zh: '' },
              bg_color: '#F0F4F8',
            })
          }
          className="w-full py-2.5 text-white font-semibold rounded-xl shadow-md hover:brightness-105 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #8CB190)` }}
        >
          <span className="text-lg">+</span> Add New Company Detail
        </Button>
      </div>
    </Card>
  );
};

export default CompanyPurposeSectionEditor;
