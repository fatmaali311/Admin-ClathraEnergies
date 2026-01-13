import React from 'react';
import InputGroup from '../../ui/InputGroup';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import LocalizedInput from '../../ui/LocalizedInput';

const WhySolutionsSectionEditor = ({ form, activeSection, PRIMARY_COLOR }) => {
    const {
        pageData,
        handleArrayItemChange,
        handleAddItem,
        handleRemoveItem,
        handleInputChange,
    } = form;

    const categories = pageData?.solutions_section || [];

    const updateTitle = (index, value) => {
        handleArrayItemChange('solutions_section', index, 'title', value);
    };

    const updateCard = (catIndex, cardIndex, value) => {
        const cards = Array.isArray(categories[catIndex]?.cards) ? [...categories[catIndex].cards] : [];
        cards[cardIndex] = value;
        handleArrayItemChange('solutions_section', catIndex, 'cards', cards);
    };

    const updateCategoryLink = (catIndex, value) => {
        handleArrayItemChange('solutions_section', catIndex, 'link', value);
    };

    const updateCardColor = (catIndex, colorIndex, value) => {
        const cardColors = Array.isArray(categories[catIndex]?.cardColors) ? [...categories[catIndex].cardColors] : [];
        cardColors[colorIndex] = value;
        handleArrayItemChange('solutions_section', catIndex, 'cardColors', cardColors);
    };

    const updateBg = (catIndex, field, value) => {
        handleArrayItemChange('solutions_section', catIndex, field, value);
    };

    const addCard = (catIndex) => {
        const cards = Array.isArray(categories[catIndex]?.cards) ? [...categories[catIndex].cards] : [];
        const cardColors = Array.isArray(categories[catIndex]?.cardColors) ? [...categories[catIndex].cardColors] : [];
        cards.push({ en: 'New Card', fr: '', zh: '' });
        cardColors.push('#000000');
        handleArrayItemChange('solutions_section', catIndex, 'cards', cards);
        handleArrayItemChange('solutions_section', catIndex, 'cardColors', cardColors);
    };

    const removeCard = (catIndex, cardIndex) => {
        const cards = Array.isArray(categories[catIndex]?.cards) ? [...categories[catIndex].cards] : [];
        const cardColors = Array.isArray(categories[catIndex]?.cardColors) ? [...categories[catIndex].cardColors] : [];
        cards.splice(cardIndex, 1);
        cardColors.splice(cardIndex, 1);
        handleArrayItemChange('solutions_section', catIndex, 'cards', cards);
        handleArrayItemChange('solutions_section', catIndex, 'cardColors', cardColors);
    };

    const addCategory = () => {
        handleAddItem('solutions_section', {
            title: { en: 'New Solutions Category', fr: '', zh: '' },
            cards: [{ en: 'New Card', fr: '', zh: '' }],
            cardColors: ['#000000'],
            link: '',
            bgFrom: '#e8f5f8',
            bgTo: '#f1faef',
        });
    };

    const removeCategory = (index) => {
        handleRemoveItem('solutions_section', index);
    };

    return (
        <section id="solutions-section" className={`${activeSection === 'solutions-section' ? '' : ''}`}>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ borderLeft: `6px solid ${PRIMARY_COLOR}`, paddingLeft: '0.75rem' }}>
                    Solutions Cards
                </h2>

                <div className="w-full">
                    <LocalizedInput
                        label="Section Title"
                        name="solutions_section_title"
                        value={pageData?.solutions_section_title}
                        onChange={(e) => handleInputChange(e)}
                    />
                </div>

                {categories.length === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">No solutions categories defined yet. Click below to add one.</div>
                )}

                <div className="space-y-6">
                    {categories.map((cat, idx) => (
                        <Card key={idx} title={cat.title?.en || 'Category'} color={PRIMARY_COLOR}>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4">
                                    <LocalizedInput
                                        label="Category Title"
                                        name={`solutions_section[${idx}].title`}
                                        value={cat.title}
                                        onChange={(e) => updateTitle(idx, e.target.value)}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-semibold text-gray-700 mb-2">Cards</label>
                                            <div className="space-y-2">
                                                {(cat.cards || []).map((card, cidx) => (
                                                    <div key={cidx} className="flex items-center gap-3">
                                                        <LocalizedInput
                                                            label={`Card ${cidx + 1}`}
                                                            name={`card_${cidx}`}
                                                            value={card}
                                                            onChange={(e) => updateCard(idx, cidx, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCard(idx, cidx)}
                                                            className="px-3 py-1.5 rounded-lg bg-white text-red-500 hover:bg-red-50 transition-all duration-300 border border-red-100 text-sm shadow-sm"
                                                            title="Remove Card"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                <div>
                                                    <div className="pt-2">
                                                        <Button
                                                            onClick={() => addCard(idx)}
                                                            className="w-full bg-transparent border-2 border-dashed border-[#ADD0B3] text-[#ADD0B3] hover:bg-[#f0faf1] transition-all duration-300 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                                                        >
                                                            <span className="text-lg">+</span> Add Content Card
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-md font-semibold text-gray-700 mb-2">Category Link (optional)</label>
                                            <input
                                                type="text"
                                                value={cat.link || ''}
                                                onChange={(e) => updateCategoryLink(idx, e.target.value)}
                                                placeholder="/path-or-external-url"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-md font-semibold text-gray-700 mb-2">Card Colors</label>
                                            <div className="space-y-2">
                                                {(cat.cardColors || []).map((color, colIdx) => (
                                                    <div key={colIdx} className="flex items-center gap-3">
                                                        <input
                                                            type="color"
                                                            value={color || '#000000'}
                                                            onChange={(e) => updateCardColor(idx, colIdx, e.target.value)}
                                                            className="w-16 h-10 p-0 border border-gray-300 rounded-lg"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={color || '#000000'}
                                                            onChange={(e) => updateCardColor(idx, colIdx, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-semibold text-gray-700 mb-2">Large card background - From</label>
                                            <div className="flex items-center gap-3">
                                                <input type="color" value={cat.bgFrom || '#f7fafc'} onChange={(e) => updateBg(idx, 'bgFrom', e.target.value)} className="w-16 h-10 p-0 border border-gray-300 rounded-lg" />
                                                <input
                                                    type="text"
                                                    value={cat.bgFrom || '#f7fafc'}
                                                    onChange={(e) => updateBg(idx, 'bgFrom', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                                                    placeholder="#FFFFFF"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold text-gray-700 mb-2">Large card background - To</label>
                                            <div className="flex items-center gap-3">
                                                <input type="color" value={cat.bgTo || '#ffffff'} onChange={(e) => updateBg(idx, 'bgTo', e.target.value)} className="w-16 h-10 p-0 border border-gray-300 rounded-lg" />
                                                <input
                                                    type="text"
                                                    value={cat.bgTo || '#ffffff'}
                                                    onChange={(e) => updateBg(idx, 'bgTo', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                                                    placeholder="#FFFFFF"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(idx)}
                                            className="px-5 py-2 rounded-xl bg-white text-red-500 font-medium hover:bg-red-50 transition-all duration-300 border border-red-200 flex items-center gap-1.5 shadow-sm text-sm"
                                        >
                                            <span className="text-lg">×</span> Remove Solutions Category
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="pt-6">
                    <Button
                        onClick={addCategory}
                        className="w-full py-3 text-white font-semibold text-lg rounded-2xl shadow-lg hover:brightness-105 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #8CB190)` }}
                    >
                        <span className="text-2xl">+</span> Add New Solutions Category
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default WhySolutionsSectionEditor;
