import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import usePageForm from '../hooks/usePageForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import HomeContentEditor from './HomeContentEditor';
import AboutUsContentEditor from './AboutUsContentEditor';
import CareersContentEditor from './CareersContentEditor';
import ContactUsContentEditor from './ContactUsContentEditor';
import ServicesContentEditor from './ServicesContentEditor';
import ApplicationManagementPage from './ApplicationManagementPage';
import WhyTechnologyContentEditor from './WhyTechnologyContentEditor';
import OurTechnologyContentEditor from './OurTechnologyContentEditor';

const DefaultEditorFallback = ({ pageTitle, isLoading }) => {
    const formattedTitle = pageTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-96 text-gray-500">
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        <span className="ml-2">Loading {formattedTitle} Page Data...</span>
                    </>
                ) : (
                    <p className="text-xl p-10 bg-white rounded-2xl shadow-xl">
                        Editor for **"{formattedTitle}"** is coming soon! 🚧
                    </p>
                )}
            </div>
        </DashboardLayout>
    );
};

const PageEditor = () => {
    const { pageTitle } = useParams();
    // Call the page form hook at the top level to satisfy the Rules of Hooks
    const form = usePageForm(pageTitle);

    switch (pageTitle) {
        case 'home':
            return <HomeContentEditor />;
        case 'about-us':
            return <AboutUsContentEditor />;
        case 'careers':
            return <CareersContentEditor />;
        case 'why-technology':
            return <WhyTechnologyContentEditor />;
        case 'our-technology':
            return <OurTechnologyContentEditor />;
        case 'contact-us':
            return <ContactUsContentEditor />;
        case 'services':
            return <ServicesContentEditor />;
        case 'applications':
            return <ApplicationManagementPage />;
        default:
            return <DefaultEditorFallback pageTitle={pageTitle} isLoading={form.isLoading} />;
    }
};

export default PageEditor;