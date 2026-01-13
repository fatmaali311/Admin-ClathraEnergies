import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getPageContentByTitle, updatePageContentWithFiles } from '../services/pageService';
import { PAGE_SCHEMAS } from '../config/pageSchemas';
import { 
    updateNestedValue, 
    updateArrayItem, 
    addArrayItem, 
    removeArrayItem 
} from '../lib/stateUtils';

const usePageForm = (pageTitle) => {
    const defaultSchema = PAGE_SCHEMAS[pageTitle] || PAGE_SCHEMAS['home'];
    const [pageData, setPageData] = useState({ title: pageTitle, ...defaultSchema });
    const [imageUrls, setImageUrls] = useState({});
    const [newFiles, setNewFiles] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const processPageResponse = useCallback((data) => {
        if (!data) return null;

        const pageObj = data.pageObj?.pageObj || data.pageObj || {};
        const updatedPageData = { title: pageTitle };

        Object.keys(defaultSchema).forEach((key) => {
            const dbValue = pageObj[key];
            const defaultValue = defaultSchema[key];

            if (dbValue === undefined || dbValue === null) {
                updatedPageData[key] = defaultValue;
            } else if (typeof dbValue === 'object' && !Array.isArray(dbValue) && defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
                // Merge objects (e.g. sections) to preserve defaults for new fields (like locations)
                updatedPageData[key] = { ...defaultValue, ...dbValue };
            } else {
                updatedPageData[key] = dbValue;
            }
        });

        // Backwards compatibility for partners_section
        if (!pageObj.partners_section && data.images) {
            const partnerKeys = Object.keys(data.images).filter(key =>
                key.startsWith('partners_section[')
            );
            if (partnerKeys.length > 0) {
                updatedPageData.partners_section = partnerKeys.map(() => ({}));
            }
        }

        // Backwards compatibility for gas_separation
        if (updatedPageData.gas_separation) {
            const gs = updatedPageData.gas_separation;
            if (gs.bg_opacity !== undefined) {
                if (gs.bg_dark_opacity === undefined) gs.bg_dark_opacity = gs.bg_opacity;
                if (gs.bg_light_opacity === undefined) gs.bg_light_opacity = gs.bg_opacity;
            }
            if (!gs.button && gs.learn_more) gs.button = gs.learn_more;
        }

        return {
            pageData: updatedPageData,
            imageUrls: data.images || {}
        };
    }, [pageTitle, defaultSchema]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getPageContentByTitle(pageTitle);
                const processed = processPageResponse(data);
                
                if (processed) {
                    setPageData(processed.pageData);
                    setImageUrls(processed.imageUrls);
                } else {
                    toast.warning(`Failed to load page "${pageTitle}". Using default schema.`);
                }
            } catch (error) {
                toast.error(`Error loading page "${pageTitle}": ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pageTitle, processPageResponse]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target || e;
        if (!name) return;
        setPageData((prev) => updateNestedValue(prev, name, value));
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFiles((prev) => ({ ...prev, [e.target.name]: file }));
        }
    }, []);

    const handleArrayItemChange = useCallback((arrayPath, index, field, value) => {
        setPageData((prev) => updateArrayItem(prev, arrayPath, index, field, value));
    }, []);

    const handleAddItem = useCallback((arrayPath, defaultItem) => {
        setPageData((prev) => addArrayItem(prev, arrayPath, defaultItem));
    }, []);

    const handleRemoveItem = useCallback((arrayPath, index) => {
        setPageData((prev) => removeArrayItem(prev, arrayPath, index));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            if (e) e.preventDefault();

            setIsSubmitting(true);
            try {
                const formData = new FormData();
                formData.append('data', JSON.stringify(pageData));
                formData.append('title', pageTitle);

                Object.entries(newFiles).forEach(([key, file]) => {
                    formData.append(key, file);
                });

                const success = await updatePageContentWithFiles(formData);

                if (success) {
                    toast.success(`Page "${pageTitle}" updated successfully!`);
                    const newData = await getPageContentByTitle(pageTitle);
                    const processed = processPageResponse(newData);
                    
                    if (processed) {
                        setPageData(processed.pageData);
                        setImageUrls(processed.imageUrls);
                    }
                    setNewFiles({});
                } else {
                    // Failures are usually handled by interceptor but we show specialized message if needed
                    toast.error(`Failed to update page "${pageTitle}".`);
                }
            } catch (error) {
                toast.error(`An error occurred: ${error.message}`);
            } finally {
                setIsSubmitting(false);
            }
        },
        [pageData, newFiles, pageTitle, processPageResponse]
    );

    return {
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
    };
};

export default usePageForm;
