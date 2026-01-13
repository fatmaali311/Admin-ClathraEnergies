/**
 * Utility functions for common state operations.
 */

/**
 * Updates a value in a nested object based on a dot-notated path.
 * @param {object} prev - Previous state object.
 * @param {string} path - Dot-notated path (e.g., 'hero_section.title').
 * @param {any} value - New value to set.
 * @returns {object} Updated state object.
 */
export const updateNestedValue = (prev, path, value) => {
    const keys = path.split('.');
    let current = { ...prev };
    let temp = current;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!temp[keys[i]] || typeof temp[keys[i]] !== 'object') {
            temp[keys[i]] = {};
        }
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    return current;
};

/**
 * Updates a field in an object within an array at a specified path.
 * @param {object} prev - Previous state object.
 * @param {string} arrayPath - Path to the array (e.g., 'bubbles' or 'hero_section.buttons').
 * @param {number} index - Index of the item in the array.
 * @param {string} field - Field name within the item.
 * @param {any} value - New value to set.
 * @returns {object} Updated state object.
 */
export const updateArrayItem = (prev, arrayPath, index, field, value) => {
    const keys = arrayPath.split('.');
    const updatedData = { ...prev };
    let temp = updatedData;

    for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]];
    }

    const arrayKey = keys[keys.length - 1];
    if (!Array.isArray(temp[arrayKey])) {
        temp[arrayKey] = [];
    }

    const array = [...temp[arrayKey]];
    array[index] = { ...(array[index] || {}), [field]: value };
    temp[arrayKey] = array;

    return updatedData;
};

/**
 * Adds a default item to an array at a specified path.
 * @param {object} prev - Previous state object.
 * @param {string} arrayPath - Path to the array.
 * @param {object} defaultItem - Default item to add.
 * @returns {object} Updated state object.
 */
export const addArrayItem = (prev, arrayPath, defaultItem) => {
    const keys = arrayPath.split('.');
    const updatedData = { ...prev };
    let temp = updatedData;

    for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]];
    }

    const arrayKey = keys[keys.length - 1];
    const array = Array.isArray(temp[arrayKey]) ? [...temp[arrayKey]] : [];
    array.push(defaultItem);

    temp[arrayKey] = array;
    return updatedData;
};

/**
 * Removes an item from an array at a specified path and index.
 * @param {object} prev - Previous state object.
 * @param {string} arrayPath - Path to the array.
 * @param {number} index - Index of the item to remove.
 * @returns {object} Updated state object.
 */
export const removeArrayItem = (prev, arrayPath, index) => {
    const keys = arrayPath.split('.');
    const updatedData = { ...prev };
    let temp = updatedData;

    for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] };
        temp = temp[keys[i]];
    }

    const arrayKey = keys[keys.length - 1];
    const array = Array.isArray(temp[arrayKey]) ? [...temp[arrayKey]] : [];
    temp[arrayKey] = array.filter((_, i) => i !== index);

    return updatedData;
};
