import React from 'react';

export default function LearningScreen({ className = '', children, dir, wide = false }) {
  const containerClass = wide ? 'container-wide' : 'container';
  const classes = [containerClass, 'learning-screen', className].filter(Boolean).join(' ');

  return (
    <main className={classes} dir={dir}>
      {children}
    </main>
  );
}
