import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import SidebarNavigation from '../components/layout/SidebarNavigation';
import Button from '../components/ui/Button';
import usePageForm from '../hooks/usePageForm';
import HeroSectionEditor from '../components/pageEditors/home/HeroSectionEditor';
import WhoWeAreSectionEditor from '../components/pageEditors/home/WhoWeAreSectionEditor';
import FeaturesSectionEditor from '../components/pageEditors/home/FeaturesSectionEditor';
import CtaSectionEditor from '../components/pageEditors/home/CtaSectionEditor';
import PartnersSectionEditor from '../components/pageEditors/home/PartnersSectionEditor';


const SECTIONS = [
    { id: 'hero-section', title: 'Hero Section' },
    { id: 'who-we-are-section', title: 'Who We Are' },
    { id: 'features-section', title: 'Features' },
    { id: 'cta-section', title: 'Call to Action' },
    { id: 'partners-section', title: 'Partners' },
];

const PRIMARY_COLOR = '#ADD0B3';

const HomeContentEditor = () => {
    const { pageTitle } = useParams();
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const form = usePageForm(pageTitle);
    const {
        pageData,
        isLoading,
        isSubmitting,
        handleSubmit,
        toast,
        closeToast
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
            return null; // Prevent rendering until pageData is available
        }

        const sectionProps = { form, activeSection, PRIMARY_COLOR };
        switch (activeSection) {
            case 'hero-section':
                return <HeroSectionEditor {...sectionProps} />;
            case 'who-we-are-section':
                return <WhoWeAreSectionEditor {...sectionProps} />;
            case 'features-section':
                return <FeaturesSectionEditor {...sectionProps} />;
            case 'cta-section':
                return <CtaSectionEditor {...sectionProps} />;
            case 'partners-section':
                return <PartnersSectionEditor {...sectionProps} />;

            default:
                return null;
        }
    }, [activeSection, form, pageData]);

    if (isLoading || !pageData) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-96 text-gray-500">
                    <LoadingSpinner /> <span className="ml-2">Loading Home Page Content...</span>
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
                    Home Page Content Editor
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
                                'Save Home Content'
                            )}
                        </Button>
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

export default HomeContentEditor;