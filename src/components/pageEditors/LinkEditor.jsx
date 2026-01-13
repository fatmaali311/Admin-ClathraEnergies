import LocalizedInput from "../ui/LocalizedInput";
import InputGroup from "../ui/InputGroup";

const LinkEditor = ({ index, linkObj, basePath, onChange, onRemove, allowRemoval }) => {
  const isArrayItem = index !== undefined && index !== null; // Check if it's an array item

  const handleChange = (field, eventOrValue) => {
    // LocalizedInput returns { target: { name, value } } or sometimes just the value depending on implementation
    // But my LocalizedInput implementation calls onChange({ target: { name, value } })

    // For LocalizedInput, the event argument is the standard event object.
    const value = eventOrValue.target ? eventOrValue.target.value : eventOrValue;

    if (isArrayItem) {
      // Logic for array items (e.g., in HeroSectionEditor)
      onChange(basePath, index, field, value);
    } else {
      // Logic for single, nested objects (e.g., in WhoWeAreSectionEditor)
      const fullName = `${basePath}.${field}`;
      // Call the parent's onChange (which is handleInputChange) with a synthetic event-like object
      onChange({ target: { name: fullName, value: value } });
    }
  };

  return (
    <div className="space-y-3 border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
      <LocalizedInput
        label="Button Name"
        name="name"
        value={linkObj.name}
        onChange={(e) => handleChange("name", e)}
      />
      <InputGroup
        title="Button Link"
        value={linkObj.link || ""}
        onChange={(e) => handleChange("link", e)}
        placeholder="Enter button URL"
      />
      {allowRemoval && isArrayItem && ( // Only allow removal for array items
        <button
          type="button"
          onClick={() => onRemove(basePath, index)}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
      )}
      {/* If it's a single item, allowRemoval can be ignored or handled differently, 
          but based on WhoWeAreSectionEditor and CtaSectionEditor, it's likely fixed 
          to 'false' and handled by the parent components. */}
    </div>
  );
};
export default LinkEditor;