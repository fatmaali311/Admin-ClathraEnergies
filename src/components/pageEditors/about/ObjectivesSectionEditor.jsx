import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import LocalizedInput from '../../ui/LocalizedInput';
import DetailItemEditor from './DetailItemEditor';

const ObjectivesSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
  const {
    pageData,
    imageUrls,
    newFiles,
    handleFileChange,
    handleArrayItemChange,
    handleAddItem,
    handleRemoveItem,
  } = form;

  const objectivesPath = 'our_strategic_objectives';
  const objectives = pageData.our_strategic_objectives || [];
  const isActive = activeSection === 'objectives';

  return (
    <Card
      title="Our Strategic Objectives"
      id="objectives"
      className={`transition-all duration-300 ${isActive ? 'ring-4 ring-opacity-50' : ''
        }`}
      style={{
        '--tw-ring-color': PRIMARY_COLOR,
      }}
    >
      <LocalizedInput
        label="Section Title"
        name="our_strategic_objectives_title"
        value={pageData.our_strategic_objectives_title}
        onChange={form.handleInputChange}
        className="mb-6"
      />
      <div className="space-y-6">
        {objectives.map((item, index) => (
          <DetailItemEditor
            key={index}
            index={index}
            item={item}
            basePath={objectivesPath}
            imageName={`objective_icon_${index + 1}`}
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
            handleAddItem(objectivesPath, {
              title: 'New Objective',
              sub_title: 'A detailed explanation of this strategic objective.',
              bg_color: '#F0F4F8',
            })
          }
          className="w-full py-2.5 text-white font-semibold rounded-xl shadow-md hover:brightness-105 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #8CB190)` }}
        >
          <span className="text-lg">+</span> Add New Strategic Objective
        </Button>
      </div>
    </Card>
  );
};

export default ObjectivesSectionEditor;
