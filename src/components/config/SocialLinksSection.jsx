
import React from 'react';
import { toast } from 'react-toastify';
import Card from '../ui/Card';
import LocalizedInput from '../ui/LocalizedInput';

const IconLookup = ({ value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-base"
  >
    <option value="">-- Select Icon --</option>
    <option value="FaFacebookF">Facebook</option>
    <option value="FaSquareXTwitter">Twitter / X</option>
    <option value="FaInstagram">Instagram</option>
    <option value="FaLinkedin">LinkedIn</option>
    <option value="FaYoutube">YouTube</option>
    <option value="FaWhatsapp">WhatsApp</option>
  </select>
);

const SocialLinksSection = ({ config, handleArrayAction, PRIMARY_COLOR }) => {
  // const { showToastLegacy } = useToast(); // Removed legacy toast hook

  const handleUpdate = (index, field, value) => {
    handleArrayAction('socialLinks', 'UPDATE', index, field, value);
  };

  const handleAdd = () => {
    handleArrayAction('socialLinks', 'ADD');
    toast.success('Social link added');
  };

  const handleRemove = (index) => {
    handleArrayAction('socialLinks', 'REMOVE', index);
    toast.success('Social link removed');
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
            <div className="w-full md:w-1/3">
              <LocalizedInput
                label="Platform Name"
                name="name"
                value={link.name}
                onChange={(e) => handleUpdate(index, 'name', e.target.value)}
              />
            </div>

            {/* Link URL */}
            <input
              type="url"
              placeholder="Full Link URL"
              value={link.link || ''}
              onChange={(e) => handleUpdate(index, 'link', e.target.value)}
              className="w-full md:w-2/5 px-3 py-2 border border-gray-300 rounded-lg text-left text-lg"
            />

            {/* Icon (select + preview) */}
            <div className="w-full md:w-1/5 flex items-center gap-3">
              <IconLookup
                value={link.iconClass || ''}
                onChange={(e) => handleUpdate(index, 'iconClass', e.target.value)}
              />

            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-600 hover:text-red-800 transition duration-150 p-2 md:w-auto w-full border border-red-200 rounded-lg"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add New Link */}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 bg-[#ADD0B3] text-white px-6 py-3 rounded-xl hover:bg-[#388E3C] transition font-semibold shadow-md"
        >
          + Add Social Link
        </button>
      </div>
    </Card>
  );
};

export default SocialLinksSection;
