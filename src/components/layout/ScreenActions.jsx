import React from 'react';

export default function ScreenActions({ className = '', centered = false, children }) {
  const classes = [
    'btn-group',
    centered ? 'screen-actions-centered' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}
