import React from 'react';
import { TRANSFER_PROBLEM } from '../../core/constants/problems';
import LearningScreen from '../layout/LearningScreen';
import ProgressBar from '../layout/ProgressBar';
import ProblemBox from '../problem/ProblemBox';
import TransferIntroCard from './TransferIntroCard';
import TransferToolList from './TransferToolList';
import TransferAnswerCard from './TransferAnswerCard';
import { TRANSFER_TOOLS } from './transferTools';

export default function TransferScreenView({
  answers,
  onAnswerChange,
  onTransferChange,
  onSubmit,
}) {
  return (
    <LearningScreen className="transfer-screen">
      <ProgressBar />
      <TransferIntroCard />
      <ProblemBox
        label={TRANSFER_PROBLEM.label}
        text={TRANSFER_PROBLEM.text}
        question={TRANSFER_PROBLEM.question}
      />
      <TransferToolList
        tools={TRANSFER_TOOLS}
        answers={answers}
        onChange={onAnswerChange}
      />
      <TransferAnswerCard
        value={answers.transfer}
        onChange={onTransferChange}
        onSubmit={onSubmit}
      />
    </LearningScreen>
  );
}
