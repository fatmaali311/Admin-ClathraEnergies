import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';

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
  const [toast, setToast] = useState({ message: '', type: '' });

  const closeToast = () => setToast({ message: '', type: '' });

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

    try {
      // Client-side size guard for large video files to avoid long hangs/failures in production
      const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB
      if (fileState?.mainVideo && fileState.mainVideo.size > MAX_VIDEO_BYTES) {
        setToast({ message: `Selected video is too large (max 50MB). Please compress or upload a smaller file.`, type: 'error' });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // ✅ Deep clone config
      const configToSend = JSON.parse(JSON.stringify(config));

      // ✅ 1. Clean up social links
      configToSend.socialLinks = (configToSend.socialLinks || []).filter(
        (link) => link.name && link.link && link.iconClass
      );

      // ✅ 2. Clean up working hours and working title
      if (configToSend.hoursTitle) {
        configToSend.working_title = configToSend.hoursTitle;
        delete configToSend.hoursTitle;
      }
      
      configToSend.workingHours = (configToSend.workingHours || [])
        .filter((item) => {
          if (item.isClosed) {
            return item.dayFrom || item.dayTo;
          }
          return item.dayFrom && item.hoursFrom && item.hoursTo;
        })
        .map((item) => {
          if (item.isClosed) {
            return {
              dayFrom: item.dayFrom || "",
              dayTo: item.dayTo || "",
              isClosed: true,
            };
          }
          return {
            dayFrom: item.dayFrom || "",
            dayTo: item.dayTo || "",
            hoursFrom: item.hoursFrom || "",
            hoursTo: item.hoursTo || "",
            isClosed: false,
          };
        });

      // ✅ 3. Remove media URLs (not needed)
      delete configToSend.mediaUrls;

      // ✅ 4. Append cleaned data to FormData
      formData.append("data", JSON.stringify(configToSend));

      // ✅ 5. Append files if exist
      if (fileState.mainLogo) formData.append("main_logo", fileState.mainLogo);
      if (fileState.secondaryLogo)
        formData.append("secondary_logo", fileState.secondaryLogo);
      if (fileState.mainVideo) formData.append("main_video", fileState.mainVideo);

      // Replaced logger call with console.log
      console.log("🚀 Sending Cleaned Configuration:", configToSend);

      // ✅ Send to backend
      const result = await updateConfigurationWithFiles(token, formData);

      if (result.success) {
        setToast({
          message: result.message || "✅ Configuration saved successfully!",
          type: "success",
        });
      } else {
        // ✅ LOGIC ADDED/IMPROVED: Display detailed errors from the backend
        let errorMsg = result.message || "❌ Failed to save configuration.";

        // Check for validation errors object
        if (result.errors && typeof result.errors === "object") {
          const fieldErrors = Object.entries(result.errors)
            .map(
              ([key, val]) =>
                `**${key}**: ${Array.isArray(val) ? val.join(", ") : val}`
            )
            .join(". "); // Changed separator for better readability in Toast

          errorMsg = `Validation failed: ${fieldErrors}`;
        }

        setToast({ message: errorMsg, type: "error" });
      }
    } catch (err) {
      // ✅ Catch unexpected client-side errors
      // Replaced logger call with console.error
      console.error("❌ Unexpected error:", err);

      setToast({
        message: `Unexpected client error: ${err.message}`,
        type: "error",
      });
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


        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
          {/* Tabs Navigation */}
          <div className="col-span-12">
            <SidebarNavigation
              sections={SECTIONS}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              primaryColor={PRIMARY_COLOR}
              variant="tabs"
            />
          </div>

          {/* Main Content */}
          <div className="col-span-12 space-y-10">
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
                handleChange={handleNestedChange}
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
              className={`w-full flex justify-center items-center gap-3 text-white py-4 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
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

      {/* ✅ Global Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
    </DashboardLayout>
  );
};

export default ConfigurationSettings;