import React from 'react';
import AnswerBox from '../problem/AnswerBox';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';

export default function TransferAnswerCard({ value, onChange, onSubmit }) {
  return (
    <AnswerBox
      title="✍️ הפתרון המלא"
      fieldLabel="הפתרון המלא"
      value={value}
      onChange={onChange}
      placeholder="כתוב/י את הפתרון המלא..."
    >
      <ScreenActions centered>
        <ActionButton onClick={onSubmit}>
          שלח/י ועבור/י לדירוג מאמץ
        </ActionButton>
      </ScreenActions>
    </AnswerBox>
  );
}
