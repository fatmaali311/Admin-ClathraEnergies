import { useState, useEffect, useCallback } from 'react';
import { getConfiguration } from '../services/configService';
import { updateNestedValue, updateArrayItem, addArrayItem, removeArrayItem } from '../lib/stateUtils';

const INITIAL_CONFIG = {
  name: { en: '', fr: '', zh: '' },
  mainColor: '',
  secondaryColor: '',
  titleColor: '',       
  subtitleColor: '', 
  heroGradientOpacity: 0.6,  
  contactInfo: {
      name: { en: '', fr: '', zh: '' },
      details: {
          email: '',
          phone: '',
          address: {
              street: '',
              city: '',
              country: '',
          }
      }
  },
  socialLinks: [],
  workingHours: [],
  working_title: { en: '', fr: '', zh: '' },
  mediaUrls: {
    mainLogoUrl: '',
    secondaryLogoUrl: '',
    mainVideoUrl: '',
    mainImageUrl: '',
  },
  copyright: { en: '', fr: '', zh: '' },
};

const normalizeConfig = (data) => {
    const toLocalized = (val) => {
        if (val && typeof val === 'object' && 'en' in val) return val;
        return { en: val || '', fr: '', zh: '' };
    };

    const toString = (val) => {
        if (val && typeof val === 'object' && 'en' in val) return val.en || '';
        return val || '';
    };

    return {
        ...data,
        name: toLocalized(data.name),
        copyright: toLocalized(data.copyright),
        working_title: toLocalized(data.working_title),
        contactInfo: {
            ...data.contactInfo,
            name: toLocalized(data.contactInfo?.name),
            details: {
                ...data.contactInfo?.details,
                address: {
                    street: toString(data.contactInfo?.details?.address?.street),
                    city: toString(data.contactInfo?.details?.address?.city),
                    country: toString(data.contactInfo?.details?.address?.country),
                }
            }
        },
        socialLinks: (data.socialLinks || []).map(link => ({
            ...link,
            name: toLocalized(link.name)
        }))
    };
};

const useConfigForm = () => {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [fileState, setFileState] = useState({
    mainLogo: null,
    secondaryLogo: null,
    mainVideo: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const data = await getConfiguration();
        if (data?.configObj) {
          const mainVideoUrl = data.videos?.main_video || data.images?.main_video || '';
          const mainImageUrl = data.images?.main_video || '';
          
          const normalizedConfig = normalizeConfig(data.configObj);

          setConfig({
            ...normalizedConfig,
            mediaUrls: {
              mainLogoUrl: data.images?.main_logo || '',
              secondaryLogoUrl: data.images?.secondary_logo || '',
              mainVideoUrl: mainVideoUrl,
              mainImageUrl: mainImageUrl,
            },
          });
        }
      } catch (err) {
        console.error('❌ Failed to load configuration:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleNestedChange = useCallback((e) => {
    const { name, value } = e.target;
    if (!name) return;
    setConfig((prev) => updateNestedValue(prev, name, value));
  }, []);

  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFileState((prev) => ({ ...prev, [name]: file }));
      const urlKey = `${name}Url`;
      setConfig((prev) => ({
        ...prev,
        mediaUrls: { ...prev.mediaUrls, [urlKey]: URL.createObjectURL(file) },
      }));
    }
  }, []);

  const handleArrayAction = useCallback((arrayName, action, index, field, value) => {
    setConfig((prev) => {
      switch (action) {
        case 'ADD': {
          const defaultItem = arrayName === 'workingHours' 
            ? { dayFrom: '', dayTo: '', hoursFrom: '', hoursTo: '', isClosed: false }
            : arrayName === 'socialLinks'
            ? { name: { en: '', fr: '', zh: '' }, link: '', iconClass: '' }
            : {};
          return addArrayItem(prev, arrayName, defaultItem);
        }
        case 'REMOVE':
          return removeArrayItem(prev, arrayName, index);
        case 'UPDATE':
          return updateArrayItem(prev, arrayName, index, field, value);
        default:
          return prev;
      }
    });
  }, []);

  const resetConfig = useCallback(() => setConfig(INITIAL_CONFIG), []);
  
  const setConfigField = useCallback((field, value) =>
    setConfig((prev) => ({ ...prev, [field]: value })), []);

  useEffect(() => {
    return () => {
      Object.values(config.mediaUrls).forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [config.mediaUrls]);

  return {
    config,
    fileState,
    isLoading,
    handleNestedChange,
    handleFileChange,
    handleArrayAction,
    resetConfig,
    setConfigField,
  };
};

export default useConfigForm;
