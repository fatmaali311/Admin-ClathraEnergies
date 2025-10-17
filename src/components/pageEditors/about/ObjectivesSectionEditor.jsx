import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
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
      className={`transition-all duration-300 ${
        isActive ? 'ring-4 ring-opacity-50' : ''
      }`}
      style={{
        '--tw-ring-color': PRIMARY_COLOR,
      }}
    >
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

      <Button
        type="button"
        onClick={() =>
          handleAddItem(objectivesPath, {
            title: 'New Objective',
            sub_title: 'A detailed explanation of this strategic objective.',
            bg_color: '#F0F4F8',
          })
        }
        className="mt-6 bg-[var(--tw-ring-color)] hover:opacity-90 text-white font-semibold py-2 rounded-xl w-full transition-all duration-200"
      >
        + Add New Strategic Objective
      </Button>
    </Card>
  );
};

export default ObjectivesSectionEditor;
