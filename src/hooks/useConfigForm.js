import { useState, useEffect, useCallback } from 'react';
import { getConfiguration } from '../services/configService';

const INITIAL_CONFIG = {
  name: '',
  mainColor: '',
  secondaryColor: '',
  titleColor: '',       
  subtitleColor: '',    
  contactInfo: { },
  socialLinks: [],
  workingHours: [],
  working_title: '',
  mediaUrls: {
    mainLogoUrl: '',
    secondaryLogoUrl: '',
    mainVideoUrl: '',
    mainImageUrl: '',
  },
  copyright: '',
};


const useConfigForm = (token) => {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [fileState, setFileState] = useState({
    mainLogo: null,
    secondaryLogo: null,
    mainVideo: null,

  });
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Load configuration from API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const data = await getConfiguration(token);
        if (data?.configObj) {
          // Check if main_video is in videos or images
          const mainVideoUrl = data.videos?.main_video || data.images?.main_video || '';
          const mainImageUrl = data.images?.main_video || '';
          
          setConfig({
            ...data.configObj,
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
  }, [token]);

  // 🔹 Handle nested property changes (like contactInfo.email)
  const handleNestedChange = useCallback((e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setConfig((prev) => {
      const newConfig = { ...prev };
      let current = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  }, []);

  // 🔹 Handle file upload preview
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

  // 🔹 Handle add/update/remove actions for arrays
  const handleArrayAction = (arrayName, action, index, field, value) => {
    setConfig((prev) => {
      const newArray = [...(prev[arrayName] || [])];

      if (action === 'ADD') {
        if (arrayName === 'workingHours') {
          newArray.push({
            dayFrom: '',
            dayTo: '',
            hoursFrom: '',
            hoursTo: '',
            isClosed: false,
          });
        } else if (arrayName === 'socialLinks') {
          newArray.push({
            name: '',
            link: '',
            iconClass: '',
          });
        } else {
          newArray.push({});
        }
      } else if (action === 'REMOVE') {
        newArray.splice(index, 1);
      } else if (action === 'UPDATE') {
        newArray[index] = { ...newArray[index], [field]: value };
      }

      return { ...prev, [arrayName]: newArray };
    });
  };

  // 🔹 Optional utilities (for flexibility)
  const resetConfig = () => setConfig(INITIAL_CONFIG);
  const setConfigField = (field, value) =>
    setConfig((prev) => ({ ...prev, [field]: value }));

  // 🔹 Cleanup for object URLs (to prevent memory leaks)
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
