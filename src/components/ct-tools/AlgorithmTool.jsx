import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogger } from '../../hooks/useLogger';
import { CTSkill, LogActionType } from '../../core/types/enums';
import { generateId } from '../../core/utils/idGenerator';
import CTToolWrapper from './CTToolWrapper';

export default function AlgorithmTool({ status }) {
  const { session, updateAlgoNodes } = useSessionContext();
  const { log } = useLogger();
  const nodes = session.toolState.algorithmic.nodes;

  const handleNodeChange = useCallback(
    (nodeId, value) => {
      updateAlgoNodes(nodes.map((n) => (n.id === nodeId ? { ...n, value } : n)));
      log(LogActionType.EDIT, { nodeId, value }, CTSkill.ALGORITHMIC);
    },
    [nodes, updateAlgoNodes, log],
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: generateId('node'),
      value: '',
      placeholder: `פעולה ${nodes.length - 1}...`,
    };
    // Keep the final node (result) last.
    const updated = [...nodes.slice(0, -1), newNode, nodes[nodes.length - 1]];
    updateAlgoNodes(updated);
    log(
      LogActionType.FLOW_NODE_ADD,
      { nodeId: newNode.id, totalNodes: updated.length },
      CTSkill.ALGORITHMIC,
    );
  }, [nodes, updateAlgoNodes, log]);

  const removeNode = useCallback(
    (nodeId) => {
      if (nodes.length <= 2) return;
      const updated = nodes.filter((n) => n.id !== nodeId);
      updateAlgoNodes(updated);
      log(
        LogActionType.STEP_REMOVE,
        { nodeId, totalNodes: updated.length },
        CTSkill.ALGORITHMIC,
      );
    },
    [nodes, updateAlgoNodes, log],
  );

  return (
    <CTToolWrapper skill={CTSkill.ALGORITHMIC} status={status}>
      <div className="flow-builder">
        {nodes.map((node, index) => {
          const isMiddle = index > 0 && index < nodes.length - 1;
          return (
            <React.Fragment key={node.id}>
              <div className="flow-node" style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={node.value}
                  placeholder={node.placeholder}
                  onChange={(e) => handleNodeChange(node.id, e.target.value)}
                />
                {isMiddle && (
                  <button
                    className="remove-step"
                    onClick={() => removeNode(node.id)}
                    style={{
                      position: 'absolute',
                      left: -30,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                    title="הסר שלב"
                    aria-label={`הסר צומת ${index + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
              {index < nodes.length - 1 && <div className="flow-arrow">↓</div>}
            </React.Fragment>
          );
        })}
      </div>

      <button
        className="btn btn-outline btn-sm"
        onClick={addNode}
        style={{ marginTop: 12 }}
      >
        + הוסף שלב בתרשים
      </button>
    </CTToolWrapper>
  );
}
