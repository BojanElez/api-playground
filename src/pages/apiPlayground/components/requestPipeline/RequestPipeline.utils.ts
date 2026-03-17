import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_ERROR,
  PIPELINE_STAGE_IDLE,
  PIPELINE_STAGE_SENDING,
  PIPELINE_STAGE_SUCCESS,
  PIPELINE_STAGE_WAITING,
  type TRequestStage,
} from '../../types';

export const stages: TRequestStage[] = [...PIPELINE_STAGES];

export const stageDescription: Record<TRequestStage, string> = {
  [PIPELINE_STAGE_IDLE]: 'No active request',
  [PIPELINE_STAGE_SENDING]: 'Request is being sent',
  [PIPELINE_STAGE_WAITING]: 'Awaiting server response',
  [PIPELINE_STAGE_SUCCESS]: 'Response received',
  [PIPELINE_STAGE_ERROR]: 'Request failed or timed out',
};

export const getStageClassName = (stage: TRequestStage) => {
  switch (stage) {
    case PIPELINE_STAGE_SENDING:
      return 'request-pipeline-stage-sending';
    case PIPELINE_STAGE_WAITING:
      return 'request-pipeline-stage-waiting';
    case PIPELINE_STAGE_SUCCESS:
      return 'request-pipeline-stage-success';
    case PIPELINE_STAGE_ERROR:
      return 'request-pipeline-stage-error';
    default:
      return 'request-pipeline-stage-idle';
  }
};
