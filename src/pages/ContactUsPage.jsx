import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useContacts } from "../hooks/useContacts";
import ContactTable from "../components/contact/ContactTable";
import {
  Pagination, Box,
  ToggleButtonGroup, ToggleButton
} from "@mui/material";


const PRIMARY_COLOR = "#ADD0B3";
const HOVER_COLOR = "#8CB190";

export default function ContactUsPage() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  // New state for the read/unread/all filter
  const [readFilter, setReadFilter] = useState('all'); // 'all', 'read', or 'unread'

  const { contacts, loading, totalPages, totalContacts, refetchContacts } =
    useContacts(page, 10, readFilter); // Pass readFilter

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) { // MUI ToggleButton behavior
      setReadFilter(newFilter);
      setPage(1); // Reset to page 1 when filter changes
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-10 text-xl text-gray-700">
        🔄 Checking session...
      </div>
    );
  }

  // Basic auth check handled by Layout/Router usually, but if needed:
  // if (!user) ... return login message

  return (
    <div className="max-w-7xl mx-auto py-8 text-left">
      {/* --- Header --- */}
      <div className="mb-8">
        <h1
          className="text-4xl font-extrabold text-gray-800 border-l-4 pl-4 mb-4"
          style={{ borderLeftColor: PRIMARY_COLOR }}
        >
          Contact Submissions
        </h1>
        <p className="text-gray-600">
          List of all messages sent via the contact form ({totalContacts || '...'} submissions)
        </p>
      </div>

      {/* --- Filter Controls --- */}
      <Box mb={3} display="flex" justifyContent="flex-start">
        <ToggleButtonGroup
          value={readFilter}
          exclusive
          onChange={handleFilterChange}
          aria-label="Contact read status filter"
          size="small"
        >
          <ToggleButton value="all">
            All ({readFilter === 'all' ? (totalContacts || 0) : '...'})
          </ToggleButton>
          <ToggleButton value="unread">
            Unread
          </ToggleButton>
          <ToggleButton value="read">
            Read
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* --- Contact Table (Pass refetchContacts) --- */}
      <ContactTable
        contacts={contacts}
        loading={loading}
        refetchContacts={refetchContacts} // Pass the function down
      />

      {/* --- Pagination --- */}
      {!loading && totalPages > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            disabled={loading}
            sx={{
              "& .MuiPaginationItem-root": {
                "&.Mui-selected": {
                  backgroundColor: PRIMARY_COLOR,
                  color: "white",
                  "&:hover": {
                    backgroundColor: HOVER_COLOR,
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </div>
  );
}
