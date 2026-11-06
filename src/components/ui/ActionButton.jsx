import React from 'react';
import MuiButton from '@mui/material/Button';

const TONE_CONFIG = {
  primary: { muiColor: 'primary', cssClass: 'btn-primary', variant: 'contained' },
  outline: { muiColor: 'inherit', cssClass: 'btn-outline', variant: 'outlined' },
  success: { muiColor: 'success', cssClass: 'btn-success', variant: 'contained' },
  warning: { muiColor: 'warning', cssClass: 'btn-warning', variant: 'contained' },
};

/** MUI button with the existing Burrito button classes kept intact. */
export default function ActionButton({ tone = 'primary', className = '', children, ...props }) {
  const config = TONE_CONFIG[tone] || TONE_CONFIG.primary;
  const classes = ['btn', config.cssClass, className].filter(Boolean).join(' ');

  return (
    <MuiButton
      {...props}
      className={classes}
      color={config.muiColor}
      variant={config.variant}
    >
      {children}
    </MuiButton>
  );
}
