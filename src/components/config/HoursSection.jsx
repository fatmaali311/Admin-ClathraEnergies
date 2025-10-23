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
            <div className="grid grid-cols-12 gap-4 items-start">
              {/* Day Range */}
              <div className="col-span-12 md:col-span-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Days</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hourBlock.dayFrom || ''}
                    onChange={(e) =>
                      handleUpdate(index, 'dayFrom', e.target.value)
                    }
                    placeholder="From Day"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-base"
                  />
                  <input
                    type="text"
                    value={hourBlock.dayTo || ''}
                    onChange={(e) =>
                      handleUpdate(index, 'dayTo', e.target.value)
                    }
                    placeholder="To Day"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-base"
                  />
                </div>
              </div>

              {/* Time Range (stacked on desktop) */}
              <div className="col-span-12 md:col-span-5">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Hours</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">From</label>
                    <TimeInput
                      name="hoursFrom"
                      value={hourBlock.hoursFrom || ''}
                      onChange={(e) =>
                        handleUpdate(index, 'hoursFrom', e.target.value)
                      }
                      disabled={hourBlock.isClosed}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">To</label>
                    <TimeInput
                      name="hoursTo"
                      value={hourBlock.hoursTo || ''}
                      onChange={(e) =>
                        handleUpdate(index, 'hoursTo', e.target.value)
                      }
                      disabled={hourBlock.isClosed}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Closed + Actions */}
              <div className="col-span-12 md:col-span-3 flex md:flex-col justify-end md:justify-between items-center gap-3">
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

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleArrayAction('workingHours', 'REMOVE', index)}
                    className="text-red-600 hover:text-red-800 transition duration-150 px-3 py-2 rounded-lg border border-red-100"
                  >
                    Delete
                  </button>
                </div>
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
