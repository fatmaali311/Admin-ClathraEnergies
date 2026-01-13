import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SidebarNavigation from '../components/layout/SidebarNavigation';
import Button from '../components/ui/Button';
import usePageForm from '../hooks/usePageForm';
import MediaUpload from '../components/ui/MediaUpload';
import { getAdminImageUrl } from '../lib/mediaUtils';
import InputGroup from '../components/ui/InputGroup';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { usePositions } from '../hooks/usePositions';
import PositionTable from '../components/position/PositionTable';
import PositionFormModal from '../components/position/PositionFormModal';
import PositionDetailsModal from '../components/position/PositionDetailsModal';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { deletePosition } from '../services/positionService';
import { Pagination, Box } from '@mui/material';
import { PRIMARY_COLOR } from '../components/Common/styles';
import LocalizedInput from '../components/ui/LocalizedInput';
import LocalizedTextArea from '../components/ui/LocalizedTextArea';
import { getLocalizedValue } from '../lib/apiUtils';

const SECTIONS = [
    { id: 'hero-section', title: 'Hero Banner' },
    { id: 'bubbles-section', title: 'Career Bubbles' },
    { id: 'application-section', title: 'Application Form' },
    { id: 'positions', title: 'Positions' },
];

const BubbleItemEditor = ({ index, bubble, basePath, imageUrls, newFiles, onChange, onFileChange, onRemove }) => {
    // Adapter for LocalizedInput's standard event
    const handleInput = (e) => {
        const fieldName = e.target.name;
        onChange(basePath, index, fieldName, e.target.value);
    };

    return (
        <div className="border border-gray-200 p-4 rounded-xl space-y-4 bg-gray-50">
            <h4 className="text-lg font-bold text-gray-800 border-b pb-2">Bubble Item #{index + 1}</h4>
            <MediaUpload
                title="Bubble Icon"
                name={`career_bubble_icon_${index + 1}`}
                fileState={newFiles[`career_bubble_icon_${index + 1}`]}
                url={imageUrls[`career_bubble_icon_${index + 1}`]}
                handleFileChange={onFileChange}
                accept="image/*"
            />
            <LocalizedInput
                label="Title"
                name="title"
                value={bubble.title}
                onChange={handleInput}
            />
            <LocalizedTextArea
                label="Paragraph"
                name="paragraph"
                value={bubble.paragraph}
                onChange={handleInput}
            />
            <Button
                type="button"
                onClick={() => onRemove(basePath, index)}
                className="bg-red-500 hover:bg-red-600 focus:ring-[#ADD0B3] w-full"
            >
                Remove Bubble
            </Button>
        </div>
    );
};

const CareersContentEditor = () => {
    const { pageTitle } = useParams();
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    // usePageForm now handles its own toast notifications via react-toastify
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
    } = usePageForm(pageTitle);

    const [posPage, setPosPage] = useState(1);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [viewingPosition, setViewingPosition] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Use autonomous pagination, but we can pass initial state if needed.
    // However, ResourceTable manages page. We just need the resource object.
    const { resource, refetchPositions } = usePositions({ page: 1, limit: 10 });

    const handleDeleteClick = React.useCallback((position) => {
        setPositionToDelete(position);
        setDeleteConfirmOpen(true);
    }, []);

    const handleConfirmDelete = React.useCallback(async () => {
        if (!positionToDelete) return;
        setIsDeleting(true);
        try {
            await deletePosition(positionToDelete._id);
            refetchPositions();
        } catch (error) {
            console.error('Failed to delete position', error);
        } finally {
            setIsDeleting(false);
            setDeleteConfirmOpen(false);
            setPositionToDelete(null);
        }
    }, [positionToDelete, refetchPositions]);

    const handleEdit = React.useCallback((position) => {
        setEditingPosition(position);
        setIsFormModalOpen(true);
    }, []);

    const handleView = React.useCallback((position) => setViewingPosition(position), []);

    const handleCloseFormModal = React.useCallback((needsRefresh = false) => {
        setIsFormModalOpen(false);
        setEditingPosition(null);
        if (needsRefresh) refetchPositions();
    }, [refetchPositions]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActiveSection(id);
    };

    const renderSection = useMemo(() => {
        if (!pageData) return null;

        switch (activeSection) {
            case 'hero-section':
                return (
                    <Card title="Hero Section" color={PRIMARY_COLOR} id="hero-section" className={activeSection === 'hero-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <MediaUpload
                            title="Hero Background Image"
                            name="career_hero_image"
                            fileState={newFiles.career_hero_image}
                            url={getAdminImageUrl(imageUrls.career_hero_image)}
                            handleFileChange={handleFileChange}
                            accept="image/*"
                        />
                        <LocalizedInput
                            label="Title"
                            name="hero_section.title"
                            value={pageData.hero_section?.title}
                            onChange={handleInputChange}
                            className="mt-6"
                        />
                        <LocalizedTextArea
                            label="Subtitle / Summary"
                            name="hero_section.sub_title"
                            value={pageData.hero_section?.sub_title}
                            onChange={handleInputChange}
                        />
                    </Card>
                );
            case 'bubbles-section':
                return (
                    <Card title="Career Bubbles" color={PRIMARY_COLOR} id="bubbles-section" className={activeSection === 'bubbles-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <p className="text-sm text-gray-600 mb-6">Manage the list of career bubbles shown on the Careers page.</p>
                        <div className="space-y-6">
                            {(pageData.bubbles || []).map((bubble, index) => (
                                <BubbleItemEditor
                                    key={index}
                                    index={index}
                                    bubble={bubble}
                                    basePath="bubbles"
                                    imageUrls={Object.fromEntries(Object.entries(imageUrls).map(([k, v]) => [k, getAdminImageUrl(v)]))}
                                    newFiles={newFiles}
                                    onChange={handleArrayItemChange}
                                    onFileChange={handleFileChange}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                        <Button
                            type="button"
                            onClick={() => handleAddItem('bubbles', { title: { en: 'New Bubble', fr: '', zh: '' }, paragraph: { en: 'Description here', fr: '', zh: '' } })}
                            className="mt-6 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
                        >
                            + Add New Bubble
                        </Button>
                    </Card>
                );
            case 'application-section':
                return (
                    <Card title="Application Form" color={PRIMARY_COLOR} id="application-section" className={activeSection === 'application-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        {[
                            { name: 'name_field_title', label: 'Name Field Title' },
                            { name: 'email_field_title', label: 'Email Field Title' },
                            { name: 'phone_title', label: 'Phone Field Title' },
                            { name: 'available_from_title', label: 'Available From Title' },
                            { name: 'location_title', label: 'Location Title' },
                            { name: 'expected_salary_title', label: 'Expected Salary Title' },
                            { name: 'cv_title', label: 'CV Title' },
                            { name: 'cover_letter_title', label: 'Cover Letter Title' },
                            { name: 'employment_reference_title', label: 'Employment Reference Title' },
                            { name: 'certificate_title', label: 'Certificate Title' },
                            { name: 'other_title', label: 'Other Title' },
                            { name: 'submit_button_title', label: 'Submit Button Title' },
                        ].map(field => (
                            <LocalizedInput
                                key={field.name}
                                label={field.label}
                                name={`application.${field.name}`}
                                value={pageData.application?.[field.name]}
                                onChange={handleInputChange}
                                className="mb-4"
                            />
                        ))}
                    </Card>
                );
            case 'positions': {
                return (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold">Job Positions</h2>
                            <p className="text-sm text-gray-600">Manage the positions used across the Careers flow.</p>
                        </div>

                        <PositionTable
                            resource={resource}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />

                        {/* Pagination is now handled by PositionTable -> ResourceTable */}
                    </div>
                );
            }
            default:
                return null;
        }
    }, [
        activeSection,
        pageData,
        newFiles,
        imageUrls,
        handleInputChange,
        handleFileChange,
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
        resource, // Added resource dependency
        isFormModalOpen,
        editingPosition,
        viewingPosition,
        deleteConfirmOpen,
        positionToDelete,
        isDeleting,
        refetchPositions,
        handleView,
        handleEdit,
        handleDeleteClick,
    ]);

    if (isLoading || !pageData) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-96 text-gray-500">
                    <LoadingSpinner /> <span className="ml-2">Loading Careers Page Content...</span>
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
                    Careers Page Content Editor
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
                        {activeSection !== 'positions' && (
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
                                    'Save Careers Content'
                                )}
                            </Button>
                        )}
                    </div>
                </form>

                {/* Modals moved outside the main form to prevent nested submission and bubbling issues */}
                <PositionFormModal
                    open={isFormModalOpen}
                    onClose={handleCloseFormModal}
                    position={editingPosition}
                />
                <PositionDetailsModal
                    open={!!viewingPosition}
                    onClose={() => setViewingPosition(null)}
                    position={viewingPosition}
                />

                <ConfirmDialog
                    open={deleteConfirmOpen}
                    onClose={(v) => setDeleteConfirmOpen(!!v)}
                    onConfirm={handleConfirmDelete}
                    title={`Confirm Deletion`}
                    message={`Are you sure you want to delete the Position: ${getLocalizedValue(positionToDelete?.name) || ''}?`}
                    confirmLabel={`Delete Position`}
                    cancelLabel={`Cancel`}
                    loading={isDeleting}
                />
            </div>
        </DashboardLayout>
    );
};

export default CareersContentEditor;