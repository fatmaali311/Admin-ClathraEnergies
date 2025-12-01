import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import SidebarNavigation from '../components/layout/SidebarNavigation';
import Button from '../components/ui/Button';
import usePageForm from '../hooks/usePageForm';
import MediaUpload from '../components/ui/MediaUpload';
import { getAdminImageUrl } from '../lib/mediaUtils';
import InputGroup from '../components/ui/InputGroup';
import Card from '../components/ui/Card';
import ContactTable from '../components/contact/ContactTable';
import { useContacts } from '../hooks/useContacts';
import { useAuth } from '../contexts/AuthContext';

const SECTIONS = [
    { id: 'hero-section', title: 'Hero Banner' },
    { id: 'paragraph-section', title: 'Paragraph' },
    { id: 'form-section', title: 'Contact Form' },
    { id: 'gps-section', title: 'GPS Location' },
    { id: 'submissions', title: 'Submissions' },
];

const PRIMARY_COLOR = '#ADD0B3';

const MenuItemEditor = ({ index, item, basePath, onChange, onRemove }) => {
    const handleInput = (e) => {
        onChange(basePath, index, e.target.name.split('.').pop(), e.target.value);
    };

    return (
        <div className="flex items-end space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex-1">
                <InputGroup
                    title={`Menu Item #${index + 1}`}
                    name="value"
                    value={item.value || ''}
                    onChange={handleInput}
                />
            </div>
            <Button
                type="button"
                onClick={() => onRemove(basePath, index)}
                className="bg-red-500 hover:bg-red-600 focus:ring-[#ADD0B3] py-3 px-4 h-full"
            >
                Remove
            </Button>
        </div>
    );
};


const ContactUsContentEditor = () => {
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
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
        handleSubmit,
        toast,
        closeToast
    } = form;
    const { token } = useAuth();

    // Submissions filter state (all | read | unread)
    const [subFilter, setSubFilter] = React.useState('all');
    const readFilterValue = subFilter === 'read' ? 'read' : subFilter === 'unread' ? 'unread' : undefined;
    const { contacts, loading: contactsLoading, refetchContacts } = useContacts(token, 1, 20, readFilterValue);

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

        switch (activeSection) {
            case 'hero-section':
                return (
                    <Card title="Hero Section" color={PRIMARY_COLOR} id="hero-section" className={activeSection === 'hero-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <MediaUpload
                            title="Hero Background Image"
                            name="contact_hero_image"
                            fileState={newFiles.contact_hero_image}
                            url={getAdminImageUrl(imageUrls.contact_hero_image)}
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
            case 'paragraph-section':
                return (
                    <Card title="Paragraph" color={PRIMARY_COLOR} id="paragraph-section" className={activeSection === 'paragraph-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-1">Paragraph</label>
                            <textarea
                                name="paragraph"
                                value={pageData.paragraph || ''}
                                onChange={handleInputChange}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ADD0B3] focus:border-[#ADD0B3] text-lg"
                            />
                        </div>
                    </Card>
                );
            case 'submissions':
                return (
                    <Card title="Contact Submissions" color={PRIMARY_COLOR} id="submissions" className={activeSection === 'submissions' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <div className="mb-4 flex items-center gap-3">
                            <button type="button" className={`px-4 py-2 rounded-full ${subFilter === 'all' ? 'bg-[#ADD0B3] text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setSubFilter('all')}>All</button>
                            <button type="button" className={`px-4 py-2 rounded-full ${subFilter === 'read' ? 'bg-[#ADD0B3] text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setSubFilter('read')}>Read</button>
                            <button type="button" className={`px-4 py-2 rounded-full ${subFilter === 'unread' ? 'bg-[#ADD0B3] text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setSubFilter('unread')}>Unread</button>
                        </div>
                        <ContactTable contacts={contacts} loading={contactsLoading} refetchContacts={refetchContacts} />
                    </Card>
                );
            case 'form-section':
                return (
                    <Card title="Contact Form" color={PRIMARY_COLOR} id="form-section" className={activeSection === 'form-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <InputGroup
                            title="Full Name Field Title"
                            name="form_section.full_name_title"
                            value={pageData.form_section?.full_name_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Organization Field Title"
                            name="form_section.organization_title"
                            value={pageData.form_section?.organization_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Email Field Title"
                            name="form_section.email_title"
                            value={pageData.form_section?.email_title || ''}
                            onChange={handleInputChange}
                        />
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Area of Interest</h3>
                            <InputGroup
                                title="Field Title"
                                name="form_section.area_of_interest.field_title"
                                value={pageData.form_section?.area_of_interest?.field_title || ''}
                                onChange={handleInputChange}
                            />
                            <div className="space-y-4 mt-4">
                                {(pageData.form_section?.area_of_interest?.field_menu_points || []).map((item, index) => (
                                    <MenuItemEditor
                                        key={index}
                                        index={index}
                                        item={item}
                                        basePath="form_section.area_of_interest.field_menu_points"
                                        onChange={handleArrayItemChange}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => handleAddItem('form_section.area_of_interest.field_menu_points', { value: 'New Option' })}
                                    className="mt-4 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
                                >
                                    + Add Menu Item
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">I Represent Field</h3>
                            <InputGroup
                                title="Field Title"
                                name="form_section.i_represent_field.field_title"
                                value={pageData.form_section?.i_represent_field?.field_title || ''}
                                onChange={handleInputChange}
                            />
                            <div className="space-y-4 mt-4">
                                {(pageData.form_section?.i_represent_field?.field_menu_points || []).map((item, index) => (
                                    <MenuItemEditor
                                        key={index}
                                        index={index}
                                        item={item}
                                        basePath="form_section.i_represent_field.field_menu_points"
                                        onChange={handleArrayItemChange}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => handleAddItem('form_section.i_represent_field.field_menu_points', { value: 'New Option' })}
                                    className="mt-4 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
                                >
                                    + Add Menu Item
                                </Button>
                            </div>
                        </div>
                        <InputGroup
                            title="Message Field Title"
                            name="form_section.message_title"
                            value={pageData.form_section?.message_title || ''}
                            onChange={handleInputChange}
                            className="mt-6"
                        />
                        <InputGroup
                            title="Submit Button Title"
                            name="form_section.submit_button_title"
                            value={pageData.form_section?.submit_button_title || ''}
                            onChange={handleInputChange}
                        />
                    </Card>
                );
            case 'gps-section':
                return (
                    <Card title="GPS Location" color={PRIMARY_COLOR} id="gps-section" className={activeSection === 'gps-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <InputGroup
                            title="GPS Location (Coordinates or Address)"
                            name="gps_location"
                            value={pageData.gps_location || ''}
                            onChange={handleInputChange}
                        />
                    </Card>
                );
            default:
                return null;
        }
    }, [activeSection, pageData, newFiles, imageUrls, handleInputChange, handleFileChange, handleArrayItemChange, handleAddItem, handleRemoveItem, contacts, contactsLoading, refetchContacts, subFilter]);

    if (isLoading || !pageData) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-96 text-gray-500">
                    <LoadingSpinner /> <span className="ml-2">Loading Contact Us Page Content...</span>
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
                    Contact Us Page Content Editor
                </h1>

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
                        {activeSection !== 'submissions' && (
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
                                    'Save Contact Us Content'
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

export default ContactUsContentEditor;