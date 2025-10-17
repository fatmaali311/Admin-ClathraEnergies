import React from 'react';
import Card from '../ui/Card';
import InputGroup from '../ui/InputGroup';

const GeneralSettingsSection = ({ config, handleChange, PRIMARY_COLOR }) => {
  return (
    <Card title="Branding & Colors" color={PRIMARY_COLOR}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <InputGroup
            title="App / Business Name"
            type="text"
            name="name"
            value={config.name}
            onChange={handleChange}
          />
        </div>

        {/* Main Color */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            Main Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              name="mainColor"
              value={config.mainColor}
              onChange={handleChange}
              className="h-14 w-14 p-1 border-none rounded-xl cursor-pointer"
            />
            <input
              type="text"
              name="mainColor"
              value={config.mainColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-lg"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            Secondary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              name="secondaryColor"
              value={config.secondaryColor}
              onChange={handleChange}
              className="h-14 w-14 p-1 border-none rounded-xl cursor-pointer"
            />
            <input
              type="text"
              name="secondaryColor"
              value={config.secondaryColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-lg"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GeneralSettingsSection;
