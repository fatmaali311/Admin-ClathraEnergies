import { useState, useEffect, useCallback } from 'react';
import { getPageContentByTitle, updatePageContentWithFiles } from '../services/pageService';
import { useAuth } from '../contexts/AuthContext';

// Define schemas for each page
const PAGE_SCHEMAS = {
    services: {
        hero_section: { title: '', sub_title: '', buttons: [] },
    },
    home: {
        hero_section: { title: '', sub_title: '', buttons: [] },
        who_we_are_section: { title: '', sub_title: '', button: { name: '', link: '' } },
        features_section: [],
        cta_section: { title: '', button: { name: '', link: '' } },
        partners_section: [],
    },
    'about-us': {
        hero_section: { title: '', sub_title: '', buttons: [] },
        company_purpose: { title: '', sub_title: '', company_details: [] },
        our_strategic_objectives: [],
    },
    careers: {
        hero_section: { title: '', sub_title: '', buttons: [] },
        bubbles: [],
        application: {
            name_field_title: '',
            email_field_title: '',
            phone_title: '',
            available_from_title: '',
            location_title: '',
            expected_salary_title: '',
            cv_title: '',
            cover_letter_title: '',
            employment_reference_title: '',
            certificate_title: '',
            other_title: '',
            submit_button_title: '',
        },
    },
    'contact-us': {
        hero_section: { title: '', sub_title: '', buttons: [] },
        paragraph: '',
        form_section: {
            full_name_title: '',
            organization_title: '',
            email_title: '',
            area_of_interest: { field_title: '', field_menu_points: [] },
            i_represent_field: { field_title: '', field_menu_points: [] },
            message_title: '',
            submit_button_title: '',
        },
        gps_location: '',
    },
    'our-technology': {
        hero_section: { title: '', sub_title: '' },
        steps: [
            { id: 1, text: 'Biogas Pre-treatment at the Farm' },
            { id: 2, text: 'Storing Biogas in compact solid form.' },
            { id: 3, text: 'Transport of Solidified Biogas to Central Hub' },
            { id: 4, text: 'Centralized Recovery and Purification' },
            { id: 5, text: 'Valorization of bioCH₄ and bioCO₂' },
            { id: 6, text: 'Agent Recycling and Return to Farms' },
        ],
    },
    'why-technology': {
        hero_section: { title: '', sub_title: '' },
        // textual sections reflecting the frontend layout
        stats_section: { methane_text: '100-170 Nm3 methane / m3', brand_text: 'ClathraEnergiesTM' },
        temp_section: { left_label: 'ClathraEnergiesTM', left_temp: '-20°C', right_label: 'BML', right_temp: '-162°C' },
        safe_section: { title: 'Safe and Green Technology' },
        economics_section: { capex_text: '25 - 50 % CAPEX', opex_text: '18 - 25 % OPEX' },
   
    },
};

const usePageForm = (pageTitle) => {
    const { token } = useAuth();
    const defaultSchema = PAGE_SCHEMAS[pageTitle] || PAGE_SCHEMAS['home'];
    const [pageData, setPageData] = useState({ title: pageTitle, ...defaultSchema });
    const [imageUrls, setImageUrls] = useState({});
    const [newFiles, setNewFiles] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    const showToast = useCallback((message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 5000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getPageContentByTitle(pageTitle);

            if (data) {
                const pageObj = data.pageObj?.pageObj || data.pageObj || {};
                const updatedPageData = { title: pageTitle };

                Object.keys(defaultSchema).forEach((key) => {
                    updatedPageData[key] = pageObj[key] || defaultSchema[key];
                });

                setImageUrls(data.images || {});

                if (!pageObj.partners_section && data.images) {
                    const partnerKeys = Object.keys(data.images).filter(key =>
                        key.startsWith('partners_section[')
                    );
                    if (partnerKeys.length > 0) {
                        updatedPageData.partners_section = partnerKeys.map(() => ({}));
                    }
                }

                setPageData(updatedPageData);
                console.log(`usePageForm - Loaded imageUrls for ${pageTitle}:`, data.images);
            } else {
                showToast(`Failed to load page "${pageTitle}". Using default schema.`, 'warning');
            }

            setIsLoading(false);
        };

        fetchData();
    }, [pageTitle, defaultSchema, showToast]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target || e;
        if (!name) {
            console.error('handleInputChange: No name provided', e);
            return;
        }
        setPageData((prevData) => {
            const keys = name.split('.');
            let current = { ...prevData };
            let temp = current;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!temp[keys[i]] || typeof temp[keys[i]] !== 'object') {
                    temp[keys[i]] = {};
                }
                temp = temp[keys[i]];
            }
            temp[keys[keys.length - 1]] = value;
            return current;
        });
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            console.log(`usePageForm - File selected for ${e.target.name}:`, file);
            setNewFiles((prev) => ({ ...prev, [e.target.name]: file }));
        }
    }, []);

    const handleArrayItemChange = useCallback((arrayPath, index, field, value) => {
        setPageData((prevData) => {
            const keys = arrayPath.split('.');
            const updatedData = { ...prevData };
            let temp = updatedData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!temp[keys[i]]) temp[keys[i]] = {};
                temp = temp[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            if (!Array.isArray(temp[arrayKey])) {
                console.warn(`Expected array at path "${arrayPath}", got:`, temp[arrayKey]);
                temp[arrayKey] = [];
            }

            const array = [...temp[arrayKey]];
            array[index] = { ...(array[index] || {}), [field]: value };
            temp[arrayKey] = array;

            return updatedData;
        });
    }, []);

    const handleAddItem = useCallback((arrayPath, defaultItem) => {
        setPageData((prevData) => {
            const keys = arrayPath.split('.');
            const updatedData = { ...prevData };
            let temp = updatedData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!temp[keys[i]]) temp[keys[i]] = {};
                temp = temp[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            const array = Array.isArray(temp[arrayKey]) ? [...temp[arrayKey]] : [];
            array.push(defaultItem);

            temp[arrayKey] = array;

            return updatedData;
        });
    }, []);

    const handleRemoveItem = useCallback((arrayPath, index) => {
        setPageData((prevData) => {
            if (!arrayPath) {
                console.error('Invalid array path provided to handleRemoveItem:', arrayPath);
                return prevData;
            }
            const keys = arrayPath.split('.');
            let current = { ...prevData };
            let temp = current;
            for (let i = 0; i < keys.length - 1; i++) {
                temp = temp[keys[i]];
            }
            const arrayKey = keys[keys.length - 1];
            const array = temp[arrayKey] ? [...temp[arrayKey]] : [];
            temp[arrayKey] = array.filter((_, i) => i !== index);
            return current;
        });
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!token) {
                showToast('You must be logged in to save changes.', 'error');
                return;
            }

            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('data', JSON.stringify(pageData));
            formData.append('title', pageTitle);

            Object.entries(newFiles).forEach(([key, file]) => {
                console.log(`usePageForm - Submitting file for ${key}:`, file);
                formData.append(key, file);
            });

            const success = await updatePageContentWithFiles(token, formData);

            if (success) {
                showToast(`Page "${pageTitle}" updated successfully!`, 'success');
                const newData = await getPageContentByTitle(pageTitle);
                if (newData) {
                    const pageObj = newData.pageObj?.pageObj || newData.pageObj || {};
                    const updatedPageData = { title: pageTitle };
                    Object.keys(defaultSchema).forEach((key) => {
                        updatedPageData[key] = pageObj[key] || defaultSchema[key];
                    });

                    // ✅ Ensure partners_section is rebuilt from images if missing
                    if (!pageObj.partners_section && newData.images) {
                        const partnerKeys = Object.keys(newData.images).filter(key =>
                            key.startsWith('partners_section[')
                        );
                        if (partnerKeys.length > 0) {
                            updatedPageData.partners_section = partnerKeys.map(() => ({}));
                        }
                    }

                    setPageData(updatedPageData);
                    setImageUrls(newData.images || {});
                    console.log(`usePageForm - Updated imageUrls for ${pageTitle}:`, newData.images);
                }
                setNewFiles({});
            } else {
                showToast(`Failed to update page "${pageTitle}".`, 'error');
            }

            setIsSubmitting(false);
        },
        [token, pageData, newFiles, pageTitle, showToast, defaultSchema]
    );

    return {
        pageData,
        imageUrls,
        newFiles,
        isLoading,
        isSubmitting,
        toast,
        handleInputChange,
        handleFileChange,
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
        handleSubmit,
        closeToast: () => setToast({ message: '', type: '' }),
        showToast,
    };
};

export default usePageForm;
