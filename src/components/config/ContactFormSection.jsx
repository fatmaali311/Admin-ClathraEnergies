import React from 'react';
import Card from '../ui/Card'; // Reusable Card
import InputGroup from '../ui/InputGroup'; // Reusable Input

const ContactFormSection = ({ config, handleChange }) => {
    return (
        <Card title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Name/Title */}
                <InputGroup
                    title="Contact Name/Title"
                    type="text"
                    name="contactInfo.name"
                    value={config?.contactInfo?.name || ''}
                    onChange={handleChange}
                />

                {/* Email Address */}
                <InputGroup
                    title="Email Address"
                    type="email"
                    name="contactInfo.details.email"
                    value={config?.contactInfo?.details?.email || ''}
                    onChange={handleChange}
                    className="text-left"
                />

                {/* Phone Number */}
                <InputGroup
                    title="Phone Number"
                    type="tel"
                    name="contactInfo.details.phone"
                    value={config?.contactInfo?.details?.phone || ''}
                    onChange={handleChange}
                    className="text-left"
                />

                <div></div> {/* Spacer */}

                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Full Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputGroup
                            title="Street Address"
                            type="text"
                            name="contactInfo.details.address.street"
                            value={config?.contactInfo?.details?.address?.street || ''}
                            onChange={handleChange}
                        />
                        <InputGroup
                            title="City"
                            type="text"
                            name="contactInfo.details.address.city"
                            value={config?.contactInfo?.details?.address?.city || ''}
                            onChange={handleChange}
                        />
                        <InputGroup
                            title="Country"
                            type="text"
                            name="contactInfo.details.address.country"
                            value={config?.contactInfo?.details?.address?.country || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ContactFormSection;
