import React from 'react';

export default function ScreenCard({ className = '', children, ...props }) {
  const classes = ['card', className].filter(Boolean).join(' ');

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
}
