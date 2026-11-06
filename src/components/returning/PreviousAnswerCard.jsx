import React from 'react';
import ScreenCard from '../layout/ScreenCard';

export default function PreviousAnswerCard({ answer }) {
  return (
    <ScreenCard>
      <h3>📝 התשובה הקודמת שלך</h3>
      <div className="return-previous-answer">
        {answer || '(לא הוזנה תשובה)'}
      </div>
    </ScreenCard>
  );
}
