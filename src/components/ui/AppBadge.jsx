import React from 'react';
import Chip from '@mui/material/Chip';

/** Chip primitive that preserves the app's existing badge palette. */
export default function AppBadge({ children, className = 'badge badge-phase' }) {
  return <Chip className={className} size="small" label={children} />;
}
