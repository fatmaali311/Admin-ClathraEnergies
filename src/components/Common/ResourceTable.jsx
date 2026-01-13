import React from 'react';
import ManagedTable from './ManagedTable';

/**
 * ResourceTable
 * Wrapper around ManagedTable that consumes a `useResource` result object.
 * Handles pagination and loading state automatically.
 * 
 * @param {object} resource - Result from useResource hook { data, loading, error, pagination, refresh }
 * @param {array} columns - Table columns
 * @param {function} renderRow - Optional action renderer
 * @param {object} leftHeader - Optional left header (filters)
 * @param {object} customHeader - Optional fully custom header
 */
export default function ResourceTable({
    resource,
    columns,
    renderRow,
    leftHeader,
    customHeader,
    addLabel,
    onAdd
}) {
    const { data, loading, error, pagination, refresh } = resource;

    // Guard against missing resource object
    if (!resource) return null;

    return (
        <ManagedTable
            rows={data}
            loading={loading}
            error={error}
            onRefresh={refresh}
            // Pagination props
            page={pagination?.page || 1}
            totalPages={pagination?.totalPages || 0}
            onPageChange={pagination?.setPage}
            // Table props
            columns={columns}
            renderRow={renderRow}
            leftHeader={leftHeader}
            customHeader={customHeader}
            addLabel={addLabel}
            onAdd={onAdd}
        />
    );
}
