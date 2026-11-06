export function getSkillLogs(logs = [], skill) {
  return logs.filter((log) => log.skill === skill);
}

export function countAction(logs, actionType) {
  return logs.filter((log) => log.actionType === actionType).length;
}
