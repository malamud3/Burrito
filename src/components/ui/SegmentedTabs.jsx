import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

/** Accessible MUI tabs styled by the existing Burrito .tabs/.tab rules. */
export default function SegmentedTabs({ tabs, value, onChange, 'aria-label': ariaLabel }) {
  return (
    <Tabs
      className="tabs"
      value={value}
      onChange={(_, nextValue) => onChange(nextValue)}
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          className={`tab ${value === tab.id ? 'active' : ''}`}
          value={tab.id}
          label={tab.label}
        />
      ))}
    </Tabs>
  );
}
