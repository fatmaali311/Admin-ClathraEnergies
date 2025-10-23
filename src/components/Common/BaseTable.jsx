import React from 'react';

/**
 * BaseTable
 * Props:
 * - columns: [{ key, label, align?, className?, render?(row) }]
 * - rows: array of data objects
 * - renderRow: optional function (row) => JSX for custom action cell(s)
 */
const BaseTable = ({ columns = [], rows = [], renderRow }) => {
  return (
    <div className="rounded-lg border overflow-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${col.align === 'center' ? 'text-center' : ''} ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
            {renderRow && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {(!rows || rows.length === 0) ? (
            <tr>
              <td colSpan={columns.length + (renderRow ? 1 : 0)} className="py-8 text-center text-gray-500">No records found.</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id || row.id || JSON.stringify(row)} className="hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-gray-700 ${col.align === 'center' ? 'text-center' : ''} ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {renderRow && <td className="px-4 py-3">{renderRow(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(BaseTable);
