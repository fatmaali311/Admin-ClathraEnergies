import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import SidebarNavigation from '../components/layout/SidebarNavigation';
import Button from '../components/ui/Button';
import usePageForm from '../hooks/usePageForm';
import MediaUpload from '../components/ui/MediaUpload';
import InputGroup from '../components/ui/InputGroup';
import Card from '../components/ui/Card';
// Position management inline imports
import { useAuth } from '../contexts/AuthContext';
import { usePositions } from '../hooks/usePositions';
import PositionTable from '../components/position/PositionTable';
import PositionFormModal from '../components/position/PositionFormModal';
import PositionDetailsModal from '../components/position/PositionDetailsModal';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { deletePosition } from '../services/positionService';
import { Pagination, Box } from '@mui/material';

const SECTIONS = [
    { id: 'hero-section', title: 'Hero Banner' },
    { id: 'bubbles-section', title: 'Career Bubbles' },
    { id: 'application-section', title: 'Application Form' },
    { id: 'positions', title: 'Positions' },
];

const PRIMARY_COLOR = '#ADD0B3';

const BubbleItemEditor = ({ index, bubble, basePath, imageUrls, newFiles, onChange, onFileChange, onRemove }) => {
    const itemPath = `${basePath}.${index}`;
    const handleInput = (e) => {
        onChange(itemPath, index, e.target.name.split('.').pop(), e.target.value);
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
            <InputGroup
                title="Title"
                name="title"
                value={bubble.title || ''}
                onChange={handleInput}
            />
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Paragraph</label>
                <textarea
                    name="paragraph"
                    value={bubble.paragraph || ''}
                    onChange={handleInput}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ADD0B3] focus:border-[#ADD0B3] text-base"
                />
            </div>
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

    // Positions inline state/hooks (lifted to component root)
    const { token } = useAuth();
    const [posPage, setPosPage] = React.useState(1);
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
    const [editingPosition, setEditingPosition] = React.useState(null);
    const [viewingPosition, setViewingPosition] = React.useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [positionToDelete, setPositionToDelete] = React.useState(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const { positions, loading: positionsLoading, totalPages, refetchPositions } = usePositions(token, posPage, 10);

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
                            name="career_hero_image"
                            fileState={newFiles.career_hero_image}
                            url={imageUrls.career_hero_image}
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
                                    imageUrls={imageUrls}
                                    newFiles={newFiles}
                                    onChange={handleArrayItemChange}
                                    onFileChange={handleFileChange}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                        <Button
                            type="button"
                            onClick={() => handleAddItem('bubbles', { title: 'New Bubble', paragraph: 'Description here' })}
                            className="mt-6 bg-[#ADD0B3] hover:bg-[#388E3C] focus:ring-[#388E3C] w-full"
                        >
                            + Add New Bubble
                        </Button>
                    </Card>
                );
            case 'application-section':
                return (
                    <Card title="Application Form" color={PRIMARY_COLOR} id="application-section" className={activeSection === 'application-section' ? `ring-4 ring-opacity-50 ring-[#ADD0B3]/50` : ''}>
                        <InputGroup
                            title="Name Field Title"
                            name="application.name_field_title"
                            value={pageData.application?.name_field_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Email Field Title"
                            name="application.email_field_title"
                            value={pageData.application?.email_field_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Phone Field Title"
                            name="application.phone_title"
                            value={pageData.application?.phone_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Available From Title"
                            name="application.available_from_title"
                            value={pageData.application?.available_from_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Location Title"
                            name="application.location_title"
                            value={pageData.application?.location_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Expected Salary Title"
                            name="application.expected_salary_title"
                            value={pageData.application?.expected_salary_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="CV Title"
                            name="application.cv_title"
                            value={pageData.application?.cv_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Cover Letter Title"
                            name="application.cover_letter_title"
                            value={pageData.application?.cover_letter_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Employment Reference Title"
                            name="application.employment_reference_title"
                            value={pageData.application?.employment_reference_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Certificate Title"
                            name="application.certificate_title"
                            value={pageData.application?.certificate_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Other Title"
                            name="application.other_title"
                            value={pageData.application?.other_title || ''}
                            onChange={handleInputChange}
                        />
                        <InputGroup
                            title="Submit Button Title"
                            name="application.submit_button_title"
                            value={pageData.application?.submit_button_title || ''}
                            onChange={handleInputChange}
                        />
                    </Card>
                );
                case 'positions': {
                    const handleDeleteClick = (position) => {
                        setPositionToDelete(position);
                        setDeleteConfirmOpen(true);
                    };

                    const handleConfirmDelete = async () => {
                        if (!positionToDelete) return;
                        setIsDeleting(true);
                        try {
                            await deletePosition(token, positionToDelete._id);
                            refetchPositions();
                        } catch (error) {
                            console.error('Failed to delete position', error);
                        } finally {
                            setIsDeleting(false);
                            setDeleteConfirmOpen(false);
                            setPositionToDelete(null);
                        }
                    };

                    const handleEdit = (position) => {
                        setEditingPosition(position);
                        setIsFormModalOpen(true);
                    };

                    const handleView = (position) => setViewingPosition(position);

                    const handleCloseFormModal = (needsRefresh = false) => {
                        setIsFormModalOpen(false);
                        setEditingPosition(null);
                        if (needsRefresh) refetchPositions();
                    };

                    return (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold">Job Positions</h2>
                                <p className="text-sm text-gray-600">Manage the positions used across the Careers flow.</p>
                            </div>

                            <PositionTable
                                positions={positions}
                                loading={positionsLoading}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                onRefresh={refetchPositions}
                            />

                            {!positionsLoading && totalPages > 0 && (
                                <Box display="flex" justifyContent="center" mt={4}>
                                    <Pagination count={totalPages} page={posPage} onChange={(e, value) => setPosPage(value)} color="primary" disabled={positionsLoading} />
                                </Box>
                            )}

                            <PositionFormModal open={isFormModalOpen} onClose={handleCloseFormModal} position={editingPosition} token={token} />
                            <PositionDetailsModal open={!!viewingPosition} onClose={() => setViewingPosition(null)} position={viewingPosition} />

                            <ConfirmDialog
                                open={deleteConfirmOpen}
                                onClose={(v) => setDeleteConfirmOpen(!!v)}
                                onConfirm={handleConfirmDelete}
                                title={`Confirm Deletion`}
                                message={`Are you sure you want to delete the Position: ${positionToDelete?.name || ''}?`}
                                confirmLabel={`Delete Position`}
                                cancelLabel={`Cancel`}
                                loading={isDeleting}
                            />
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
        // positions-related deps
        positions,
        positionsLoading,
        totalPages,
        posPage,
        isFormModalOpen,
        editingPosition,
        viewingPosition,
        deleteConfirmOpen,
        positionToDelete,
        isDeleting,
        token,
        refetchPositions,
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
            </div>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </DashboardLayout>
    );
};

export default CareersContentEditor;