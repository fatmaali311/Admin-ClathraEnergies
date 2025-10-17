import React from 'react';
import Card from '../ui/Card';
import TimeInput from '../ui/TimeInput';

const HoursSection = ({ config, handleArrayAction, PRIMARY_COLOR }) => {
  const handleUpdate = (index, field, value) => {
    handleArrayAction('workingHours', 'UPDATE', index, field, value);
  };

  return (
    <Card title="Working Hours & Schedule" color={PRIMARY_COLOR}>
      <div className="space-y-6">
        {(config?.workingHours || []).map((hourBlock, index) => (
          <div
            key={index}
            className="p-5 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Day From/To Inputs */}
              <div className="col-span-12 md:col-span-4 flex items-center gap-2">
                <input
                  type="text"
                  value={hourBlock.dayFrom || ''}
                  onChange={(e) =>
                    handleUpdate(index, 'dayFrom', e.target.value)
                  }
                  placeholder="From Day"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="text"
                  value={hourBlock.dayTo || ''}
                  onChange={(e) =>
                    handleUpdate(index, 'dayTo', e.target.value)
                  }
                  placeholder="To Day"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              {/* Closed Checkbox */}
              <div className="col-span-12 md:col-span-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hourBlock.isClosed || false}
                    onChange={(e) =>
                      handleUpdate(index, 'isClosed', e.target.checked)
                    }
                    className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500 mr-2"
                  />
                  <span className="text-red-600 font-semibold">Closed</span>
                </label>
              </div>

              {/* Time Pickers */}
              <div className="col-span-12 md:col-span-4 flex items-center gap-2">
                <TimeInput
                  name="hoursFrom"
                  value={hourBlock.hoursFrom || ''}
                  onChange={(e) =>
                    handleUpdate(index, 'hoursFrom', e.target.value)
                  }
                  disabled={hourBlock.isClosed}
                />
                <span className="text-gray-500">until</span>
                <TimeInput
                  name="hoursTo"
                  value={hourBlock.hoursTo || ''}
                  onChange={(e) =>
                    handleUpdate(index, 'hoursTo', e.target.value)
                  }
                  disabled={hourBlock.isClosed}
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-12 md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    handleArrayAction('workingHours', 'REMOVE', index)
                  }
                  className="text-red-600 hover:text-red-800 transition duration-150 p-2 rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Period */}
        <button
          type="button"
          onClick={() => handleArrayAction('workingHours', 'ADD')}
          className="mt-4 bg-[#ADD0B3] text-white px-6 py-3 rounded-xl hover:bg-[#388E3C] transition font-semibold shadow-md"
        >
          + Add Working Period
        </button>
      </div>
    </Card>
  );
};

export default HoursSection;
