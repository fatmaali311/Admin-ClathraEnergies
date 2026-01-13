/**
 * Robustly extracts a string ID from various formats (string, object, buffer, etc.)
 * Useful for handling MongoDB IDs that might be received in complex forms.
 */
export const getExtractableId = (idOrObj) => {
    if (!idOrObj) return '';
    
    // Extract base value if it's an object with _id or id
    let val = (typeof idOrObj === 'object') ? (idOrObj._id || idOrObj.id || idOrObj) : idOrObj;
    
    if (!val) return '';
    // If it's a string, it might be a raw ID or a JSON-encoded object
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            if (typeof parsed === 'object' && parsed !== null) {
                val = parsed; // continue processing as object
            } else {
                return val; // plain string ID
            }
        } catch (e) {
            // Not JSON, treat as plain string ID
            return val;
        }
    }    
    // Handle MongoDB/EJSON Objects
    if (val.$oid) return val.$oid;
    if (typeof val.toHexString === 'function') return val.toHexString();
    
    // Handle Buffer/Binary objects (like {"buffer": {...}} or Uint8Array)
    const bufferData = val.buffer || (val.constructor && val.constructor.name === 'Buffer' ? val : null);
    if (bufferData) {
        try {
            // If it's the specific {buffer: {0: ...}} format or a raw array-like object
            const bytes = (bufferData.data || Object.values(bufferData)).filter(x => typeof x === 'number');
            if (bytes.length > 0) {
                return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
            }
        } catch (e) {
            console.warn("Failed to convert buffer ID to hex", e);
        }
    }

    // Standard toString if it's helpful
    if (typeof val.toString === 'function' && val.toString() !== '[object Object]') {
        return val.toString();
    }
    
    // Last resort
    try {
        return typeof val === 'object' ? JSON.stringify(val) : String(val);
    } catch (e) {
        return String(val);
    }
};
/**
 * Safely extracts a displayable string from a potentially localized object.
 * If val is { en: "...", fr: "...", zh: "..." }, it extracts the requested language.
 */
export const getLocalizedValue = (val, lang = 'en') => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
        // Many localized fields might only have one of these keys.
        return val[lang] || val.en || val.fr || val.zh || '';
    }
    return String(val);
};
