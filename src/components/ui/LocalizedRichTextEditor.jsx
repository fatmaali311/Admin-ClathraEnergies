import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import RichTextEditor from './RichTextEditor';

const LocalizedRichTextEditor = ({
    label,
    name,
    value,
    onChange,
    required = false,
    className = '',
    placeholder = '',
}) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleEditorChange = (htmlContent, lang) => {
        // We send back an object mocking a synthetic event for compatibility with form handlers
        onChange({
            target: {
                name,
                value: {
                    ...value,
                    [lang]: htmlContent,
                },
            },
        });
    };

    return (
        <Box className={className} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
                {label} {required && <span className="text-red-500">*</span>}
            </Typography>

            <Box sx={{ border: 1, borderColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: '#e0e0e0',
                        minHeight: 40,
                        bgcolor: '#fafafa',
                        '& .MuiTab-root': { minHeight: 40, py: 1, fontWeight: 'bold' }
                    }}
                >
                    <Tab label="English (EN)" />
                    <Tab label="Français (FR)" />
                    <Tab label="中文 (ZH)" />
                </Tabs>

                {activeTab === 0 && (
                    <Box sx={{ p: 2, bgcolor: '#f9fafb' }}>
                        <RichTextEditor
                            value={value?.en || ''}
                            onChange={(html) => handleEditorChange(html, 'en')}
                            placeholder={placeholder || `Enter ${label.toLowerCase()} in English`}
                        />
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box sx={{ p: 2, bgcolor: '#f9fafb' }}>
                        <RichTextEditor
                            value={value?.fr || ''}
                            onChange={(html) => handleEditorChange(html, 'fr')}
                            placeholder={placeholder || `Enter ${label.toLowerCase()} in French`}
                        />
                    </Box>
                )}
                {activeTab === 2 && (
                    <Box sx={{ p: 2, bgcolor: '#f9fafb' }}>
                        <RichTextEditor
                            value={value?.zh || ''}
                            onChange={(html) => handleEditorChange(html, 'zh')}
                            placeholder={placeholder || `Enter ${label.toLowerCase()} in Chinese`}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default LocalizedRichTextEditor;
