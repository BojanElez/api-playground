import './RequestPipeline.css';
import type { TRequestStage } from '../../types';
import { getStageClassName, stageDescription, stages } from './RequestPipeline.utils';

const RequestPipeline = ({ currentStage }: { currentStage: TRequestStage }) => {
  return (
    <div className="request-pipeline" aria-live="polite">
      {stages.map((stage) => {
        const isActive = currentStage === stage;
        const stageClassName = getStageClassName(stage);

        return (
          <div
            key={stage}
            className={[
              'request-pipeline-stage',
              stageClassName,
              isActive ? 'request-pipeline-stage-active' : '',
            ]
              .join(' ')
              .trim()}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="request-pipeline-stage-title">{stage.toUpperCase()}</span>
            <span className="request-pipeline-stage-caption">{stageDescription[stage]}</span>
          </div>
        );
      })}
    </div>
  );
};

export default RequestPipeline;
