import React from 'react';
import Card from '../ui/Card';
import InputGroup from '../ui/InputGroup';

const GeneralSettingsSection = ({ config, handleChange, PRIMARY_COLOR }) => {
  return (
    <Card title="Branding & Colors" color={PRIMARY_COLOR}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* App / Business Name */}
        <div className="md:col-span-3">
          <InputGroup
            title="App / Business Name"
            type="text"
            name="name"
            value={config.name}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Copyright */}
        <div className="md:col-span-3">
          <InputGroup
            title="Copyright Text"
            type="text"
            name="copyright"
            value={config.copyright || '©2025 ClathraEnergies'}
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
        {/* Title Color */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            Title Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              name="titleColor"
              value={config.titleColor}
              onChange={handleChange}
              className="h-14 w-14 p-1 border-none rounded-xl cursor-pointer"
            />
            <input
              type="text"
              name="titleColor"
              value={config.titleColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-lg"
            />
          </div>
        </div>

        {/* Subtitle Color */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            Subtitle Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              name="subtitleColor"
              value={config.subtitleColor}
              onChange={handleChange}
              className="h-14 w-14 p-1 border-none rounded-xl cursor-pointer"
            />
            <input
              type="text"
              name="subtitleColor"
              value={config.subtitleColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-lg"
            />
          </div>
        </div>

        {/* 🚀 UPDATED: Hero Gradient Opacity Control */}
        <div className="md:col-span-2">
          <label className="block text-md font-semibold text-gray-700 mb-2">
            Hero Gradient Opacity (Density)
          </label>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            {/* Range Slider for visual adjustment */}
            <input
              type="range"
              name="heroGradientOpacity"
              min="0"
              max="1"
              step="0.05"
              value={config.heroGradientOpacity}
              onChange={handleChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: PRIMARY_COLOR }} // Style slider handle
              title="Drag to change opacity"
            />
            {/* Text Input for precise value */}
            <input
              type="number"
              name="heroGradientOpacity"
              min="0"
              max="1"
              step="0.05"
              value={config.heroGradientOpacity}
              onChange={handleChange}
              className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            0.0 (Clear) to 1.0 (Solid). Controls the darkness of the overlay.
          </p>
        </div>


      </div>
    </Card>
  );
};

export default GeneralSettingsSection;