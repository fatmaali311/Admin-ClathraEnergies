
import React from 'react';
import Card from '../ui/Card';

const IconLookup = ({ value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-base"
  >
    <option value="">-- Select Icon --</option>
    <option value="fa-facebook">Facebook</option>
    <option value="fa-twitter">Twitter / X</option>
    <option value="fa-instagram">Instagram</option>
    <option value="fa-linkedin">LinkedIn</option>
    <option value="fa-youtube">YouTube</option>
    <option value="fa-whatsapp">WhatsApp</option>
  </select>
);

const SocialLinksSection = ({ config, handleArrayAction, PRIMARY_COLOR }) => {
  const handleUpdate = (index, field, value) => {
    handleArrayAction('socialLinks', 'UPDATE', index, field, value);
  };

  return (
    <Card title="Social Media Links" color={PRIMARY_COLOR}>
      <div className="space-y-6">
        {(config?.socialLinks || []).map((link, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            {/* Name */}
            <input
              type="text"
              placeholder="Platform Name"
              value={link.name || ''}
              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
              className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-lg text-lg"
            />

            {/* Link URL */}
            <input
              type="url"
              placeholder="Full Link URL"
              value={link.link || ''}
              onChange={(e) => handleUpdate(index, 'link', e.target.value)}
              className="w-full md:w-2/5 px-3 py-2 border border-gray-300 rounded-lg text-left text-lg"
            />

            {/* Icon */}
            <div className="w-full md:w-1/5">
              <IconLookup
                value={link.iconClass || ''}
                onChange={(e) => handleUpdate(index, 'iconClass', e.target.value)}
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleArrayAction('socialLinks', 'REMOVE', index)}
              className="text-red-600 hover:text-red-800 transition duration-150 p-2 md:w-auto w-full border border-red-200 rounded-lg"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add New Link */}
        <button
          type="button"
          onClick={() => handleArrayAction('socialLinks', 'ADD')}
          className="mt-4 bg-[#ADD0B3] text-white px-6 py-3 rounded-xl hover:bg-[#388E3C] transition font-semibold shadow-md"
        >
          + Add Social Link
        </button>
      </div>
    </Card>
  );
};

export default SocialLinksSection;
