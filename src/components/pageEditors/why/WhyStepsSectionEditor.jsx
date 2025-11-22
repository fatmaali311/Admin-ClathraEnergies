import React from 'react';
import Card from '../../ui/Card';
import InputGroup from '../../ui/InputGroup';
import Button from '../../ui/Button';
import MediaUpload from '../../ui/MediaUpload';
import { getAdminImageUrl } from '../../../lib/mediaUtils';

const WhyStepsSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        imageUrls,
        newFiles,
        handleFileChange,
        handleInputChange,
    } = form;

    const activeCardClass = activeSection === 'steps-section' ? `ring-4 ring-opacity-50` : '';

    // textual fields for the Why page
    const stats = pageData.stats_section || {};
    const temps = pageData.temp_section || {};
    const safe = pageData.safe_section || {};
    const econ = pageData.economics_section || {};

    return (
        <Card title="Why Page Content" color={PRIMARY_COLOR} id="steps-section" className={activeCardClass}>
            <p className="text-gray-600 mb-4">Manage images and text used across the Why Technology page.</p>

            {/* Additional images used by the Why page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <MediaUpload
                    title="Left Input Sphere (ballLeft)"
                    name="why_ball_left"
                    fileState={newFiles?.why_ball_left}
                    url={getAdminImageUrl(imageUrls?.why_ball_left)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Right Output Sphere (ballRight)"
                    name="why_ball_right"
                    fileState={newFiles?.why_ball_right}
                    url={getAdminImageUrl(imageUrls?.why_ball_right)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Hot Thermometer (tempHot)"
                    name="why_temp_hot"
                    fileState={newFiles?.why_temp_hot}
                    url={getAdminImageUrl(imageUrls?.why_temp_hot)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Cold Thermometer (tempCold)"
                    name="why_temp_cold"
                    fileState={newFiles?.why_temp_cold}
                    url={getAdminImageUrl(imageUrls?.why_temp_cold)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Sun Icon 1 (sun1)"
                    name="why_sun1"
                    fileState={newFiles?.why_sun1}
                    url={getAdminImageUrl(imageUrls?.why_sun1)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Sun Icon 2 (sun2)"
                    name="why_sun2"
                    fileState={newFiles?.why_sun2}
                    url={getAdminImageUrl(imageUrls?.why_sun2)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Safe & Green Icon (greenSafe)"
                    name="why_green_safe"
                    fileState={newFiles?.why_green_safe}
                    url={getAdminImageUrl(imageUrls?.why_green_safe)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Money Icon"
                    name="why_money"
                    fileState={newFiles?.why_money}
                    url={getAdminImageUrl(imageUrls?.why_money)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
                <MediaUpload
                    title="Growth Icon"
                    name="why_growth"
                    fileState={newFiles?.why_growth}
                    url={getAdminImageUrl(imageUrls?.why_growth)}
                    handleFileChange={handleFileChange}
                    accept="image/*"
                />
            </div>

            {/* Text fields used throughout the Why page */}
            {/* Stats section: include a section title plus two text fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputGroup
                    title="Stats Section Title"
                    name="stats_section.title"
                    value={stats.title || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Methane Text"
                    name="stats_section.methane_text"
                    value={stats.methane_text || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Brand Label"
                    name="stats_section.brand_text"
                    value={stats.brand_text || ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Temperature section title (separate row) */}
            <div className="mb-4">
                <InputGroup
                    title="Temperature Section Title"
                    name="temp_section.title"
                    value={temps.title || ''}
                    onChange={handleInputChange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <InputGroup
                    title="Left Section Label"
                    name="temp_section.left_label"
                    value={temps.left_label || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Left Temperature"
                    name="temp_section.left_temp"
                    value={temps.left_temp || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Right Section Label"
                    name="temp_section.right_label"
                    value={temps.right_label || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Right Temperature"
                    name="temp_section.right_temp"
                    value={temps.right_temp || ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Safe Section Title and Card Label (grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputGroup
                    title="Safe Section Title"
                    name="safe_section.title"
                    value={safe.title || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="Safe Card Label"
                    name="safe_section.card_label"
                    value={safe.card_label || ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Economics Section Title (separate row like Temperature) */}
            <div className="mb-4">
                <InputGroup
                    title="Economics Section Title"
                    name="economics_section.title"
                    value={econ.title || ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Economics CAPEX & OPEX Texts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <InputGroup
                    title="CAPEX Text"
                    name="economics_section.capex_text"
                    value={econ.capex_text || ''}
                    onChange={handleInputChange}
                />
                <InputGroup
                    title="OPEX Text"
                    name="economics_section.opex_text"
                    value={econ.opex_text || ''}
                    onChange={handleInputChange}
                />
            </div>


        </Card>
    );
};

export default WhyStepsSectionEditor;
