import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Reusable Components
import SidebarNavigation from '../components/layout/SidebarNavigation';
import useConfigForm from '../hooks/useConfigForm';
import { updateConfigurationWithFiles } from '../services/configService';

// Feature Sections
import ContactFormSection from '../components/config/ContactFormSection';
import GeneralSettingsSection from '../components/config/GeneralSettingsSection';
import SocialLinksSection from '../components/config/SocialLinksSection';
import HoursSection from '../components/config/HoursSection';
import MediaUploadSection from '../components/config/MediaUploadSection';

const SECTIONS = [
  { id: 'general', title: 'Branding & Colors' },
  { id: 'contact', title: 'Contact Information' },
  { id: 'social', title: 'Social Links' },
  { id: 'hours', title: 'Working Hours' },
  { id: 'media', title: 'Media Uploads' },
];

const PRIMARY_COLOR = '#ADD0B3';

const ConfigurationSettings = () => {
  const token = localStorage.getItem('token');
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  // Custom Hook
  const {
    config,
    fileState,
    isLoading,
    handleNestedChange,
    handleFileChange,
    handleArrayAction,
  } = useConfigForm(token);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setAlert({ show: false, message: '', type: 'info' });

  try {
    const formData = new FormData();

    // ✅ Deep clone config
    const configToSend = JSON.parse(JSON.stringify(config));

    // ✅ 1. Clean up social links
    configToSend.socialLinks = (configToSend.socialLinks || []).filter(
      (link) => link.name && link.link && link.iconClass
    );

    // ✅ 2. Clean up working hours
    configToSend.workingHours = (configToSend.workingHours || []).filter((item) => {
      // if marked as closed, only send { dayFrom, dayTo, isClosed }
      if (item.isClosed) {
        return item.dayFrom || item.dayTo; // only if it has days defined
      }
      // if open, ensure all fields have values
      return (
        item.dayFrom &&
        item.dayTo &&
        item.hoursFrom &&
        item.hoursTo &&
        item.isClosed !== undefined
      );
    }).map((item) => {
      // if closed, remove unnecessary fields
      if (item.isClosed) {
        return {
          dayFrom: item.dayFrom,
          dayTo: item.dayTo,
          isClosed: true,
        };
      }
      return item;
    });

    // ✅ 3. Remove media URLs (not needed)
    delete configToSend.mediaUrls;

    // ✅ 4. Append cleaned data to FormData
    formData.append('data', JSON.stringify(configToSend));

    // ✅ 5. Append files if exist
    if (fileState.mainLogo) formData.append('main_logo', fileState.mainLogo);
    if (fileState.secondaryLogo) formData.append('secondary_logo', fileState.secondaryLogo);
    if (fileState.mainVideo) formData.append('main_video', fileState.mainVideo);

    console.log('🚀 Sending Cleaned Configuration:', configToSend);

    const success = await updateConfigurationWithFiles(token, formData);

    if (success) {
      setAlert({
        show: true,
        type: 'success',
        message: 'Configuration settings saved successfully!',
      });
    } else {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to save configuration. Please try again.',
      });
    }
  } catch (err) {
    setAlert({
      show: true,
      type: 'error',
      message: `Unexpected error: ${err.message}`,
    });
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96 text-gray-500">
          <LoadingSpinner /> <span className="ml-2">Loading Settings...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 text-left" dir="ltr">
        <h1
          className="text-4xl font-extrabold text-gray-800 border-l-4 pl-4 mb-8"
          style={{ borderLeftColor: PRIMARY_COLOR }}
        >
          System Configuration
        </h1>

        <div className="mb-6 max-w-4xl mx-auto">
          <Alert
            show={alert.show}
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: 'info', message: '' })}
          />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <SidebarNavigation
              sections={SECTIONS}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              primaryColor={PRIMARY_COLOR}
            />
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 space-y-10">
            {activeSection === 'general' && (
              <GeneralSettingsSection
                config={config}
                handleChange={handleNestedChange}
                PRIMARY_COLOR={PRIMARY_COLOR}
              />
            )}
            {activeSection === 'contact' && (
              <ContactFormSection
                config={config}
                handleChange={handleNestedChange}
                PRIMARY_COLOR={PRIMARY_COLOR}
              />
            )}
            {activeSection === 'social' && (
              <SocialLinksSection
                config={config}
                handleArrayAction={handleArrayAction}
                PRIMARY_COLOR={PRIMARY_COLOR}
              />
            )}
            {activeSection === 'hours' && (
              <HoursSection
                config={config}
                handleArrayAction={handleArrayAction}
                PRIMARY_COLOR={PRIMARY_COLOR}
              />
            )}
            {activeSection === 'media' && (
              <MediaUploadSection
                config={config}
                fileState={fileState}
                handleFileChange={handleFileChange}
                PRIMARY_COLOR={PRIMARY_COLOR}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center gap-3 text-white py-4 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner color="white" /> Saving All Settings...
                </>
              ) : (
                'Save All Configuration Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ConfigurationSettings;
