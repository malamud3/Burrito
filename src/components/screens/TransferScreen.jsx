import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import TransferScreenView from '../transfer/TransferScreenView';

export default function TransferScreen() {
  const { session, setAnswer } = useSessionContext();
  const { goToEffort } = usePhaseNavigation();
  const { log } = useLogger();
  const { show } = useNotification();

  const handleAnswerChange = useCallback(
    (key, value) => setAnswer(key, value),
    [setAnswer],
  );

  const handleTransferChange = useCallback(
    (value) => setAnswer('transfer', value),
    [setAnswer],
  );

  const handleSubmit = useCallback(() => {
    if (!session.answers.transfer?.trim()) return show('נא לכתוב תשובה', '⚠️');

    log(LogActionType.TRANSFER_SUBMIT, {
      answer: session.answers.transfer,
      decomp: session.answers.transferDecomp,
      abstract: session.answers.transferAbstract,
      algo: session.answers.transferAlgo,
    });

    show('תשובה נשלחה! שלב אחרון — דירוג מאמץ.', '✅');
    goToEffort();
    return undefined;
  }, [session.answers, log, goToEffort, show]);

  return (
    <TransferScreenView
      answers={session.answers}
      onAnswerChange={handleAnswerChange}
      onTransferChange={handleTransferChange}
      onSubmit={handleSubmit}
    />
  );
}
