import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ServicesDashboard from './ServicesDashboard';
import DashboardLayout from '../layout/DashboardLayout';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import SidebarNavigation from '../components/layout/SidebarNavigation';
import Button from '../components/ui/Button';
import usePageForm from '../hooks/usePageForm';
import MediaUpload from '../components/ui/MediaUpload';
import { getAdminImageUrl } from '../lib/mediaUtils';
import InputGroup from '../components/ui/InputGroup';
import Card from '../components/ui/Card';
import LinkEditor from '../components/pageEditors/LinkEditor';

const SECTIONS = [
    { id: 'hero-section', title: 'Hero Banner' },
    { id: 'services-dashboard', title: 'Services' },
];

const PRIMARY_COLOR = '#ADD0B3';

const ServicesContentEditor = () => {
    const { pageTitle } = useParams();
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const form = usePageForm(pageTitle);
    const {
        pageData,
        imageUrls,
        newFiles,
        isLoading,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleSubmit,
        toast,
        closeToast,
    } = form;


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActiveSection(id);
    };

    const renderSection = useMemo(() => {
        if (!pageData) {
            return null;
        }

        if (activeSection === 'services-dashboard') {
            return (
                <div id="services-dashboard">
                    <ServicesDashboard />
                </div>
            );
        }

        return (
            <Card
                title="Hero Section"
                color={PRIMARY_COLOR}
                id="hero-section"
                className={activeSection === 'hero-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}
            >
                <MediaUpload
                    title="Hero Background Image"
                    name="services_hero_image"
                    fileState={newFiles.services_hero_image}
                    url={getAdminImageUrl(imageUrls.services_hero_image)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <InputGroup
                    title="Title"
                    name="hero_section.title"
                    value={pageData.hero_section?.title || ''}
                    onChange={handleInputChange}
                    className="mt-6"
                />
                <div>
                    <label className="block text-md font-semibold text-gray-700 mb-1">Subtitle / Summary</label>
                    <textarea
                        name="hero_section.sub_title"
                        value={pageData.hero_section?.sub_title || ''}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ADD0B3] focus:border-[#ADD0B3] text-lg"
                    />
                </div>
               
            </Card>
        );
    }, [activeSection, pageData, newFiles, imageUrls, handleInputChange, handleFileChange]);

    if (isLoading || !pageData) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-96 text-gray-500">
                    <LoadingSpinner /> <span className="ml-2">Loading Services Page Content...</span>
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
                    Services Page Content Editor
                </h1>
                <div className="mb-6 max-w-4xl mx-auto">
                    {toast.message && (
                        <Alert
                            show={true}
                            type={toast.type}
                            message={toast.message}
                            onClose={closeToast}
                        />
                    )}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
                    <div className="col-span-12">
                        <SidebarNavigation
                            sections={SECTIONS}
                            activeSection={activeSection}
                            setActiveSection={scrollToSection}
                            primaryColor={PRIMARY_COLOR}
                            variant="tabs"
                        />
                    </div>
                    <div className="col-span-12 space-y-10">
                        {renderSection}
                        {activeSection !== 'services-dashboard' && (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center gap-3 text-white py-4 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-xl`}
                                style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner color="white" /> Saving Changes...
                                    </>
                                ) : (
                                    'Save Services Content'
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </DashboardLayout>
    );
};

export default ServicesContentEditor;