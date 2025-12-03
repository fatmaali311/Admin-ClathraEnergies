import React from 'react';
import InputGroup from '../../ui/InputGroup';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

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
        cards.push('New Card');
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
            title: 'New Solutions Category',
            cards: ['New Card'],
            cardColors: ['#000000'],
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
                    <InputGroup
                        title="Section Title"
                        name="solutions_section_title"
                        value={pageData?.solutions_section_title || 'Our Innovative Solutions'}
                        onChange={(e) => handleInputChange(e)}
                    />
                </div>

                {categories.length === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">No solutions categories defined yet. Click below to add one.</div>
                )}

                <div className="space-y-6">
                    {categories.map((cat, idx) => (
                        <Card key={idx} title={cat.title || 'Category'} color={PRIMARY_COLOR}>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4">
                                    <InputGroup
                                        title="Category Title"
                                        name={`solutions_section[${idx}].title`}
                                        value={cat.title || ''}
                                        onChange={(e) => updateTitle(idx, e.target.value)}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-semibold text-gray-700 mb-2">Cards</label>
                                            <div className="space-y-2">
                                                {(cat.cards || []).map((card, cidx) => (
                                                    <div key={cidx} className="flex items-center gap-3">
                                                        <input
                                                            type="text"
                                                            value={card}
                                                            onChange={(e) => updateCard(idx, cidx, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCard(idx, cidx)}
                                                            className="px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <div>
                                                    <Button onClick={() => addCard(idx)}>+ Add Card</Button>
                                                </div>
                                            </div>
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

                                    <div className="flex items-center gap-3 mt-4">
                                        <Button onClick={() => removeCategory(idx)} className="bg-red-500 hover:bg-red-600">Remove Category</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="pt-4">
                    <Button onClick={addCategory}>Add New Solutions Category</Button>
                </div>
            </div>
        </section>
    );
};

export default WhySolutionsSectionEditor;
