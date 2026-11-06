import React from 'react';

export default function ScreenTitle({ eyebrow, title }) {
  return (
    <header className="renato-title">
      <span className="renato-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
    </header>
  );
}
