import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestPipeline from './RequestPipeline';
import { PIPELINE_STAGE_IDLE, PIPELINE_STAGE_SUCCESS, PIPELINE_STAGE_WAITING } from '../../types';

describe('RequestPipeline', () => {
  it('renders every request stage with its description', () => {
    render(<RequestPipeline currentStage={PIPELINE_STAGE_IDLE} />);

    expect(screen.getByText('IDLE')).toBeInTheDocument();
    expect(screen.getByText('No active request')).toBeInTheDocument();
    expect(screen.getByText('SENDING')).toBeInTheDocument();
    expect(screen.getByText('Request is being sent')).toBeInTheDocument();
    expect(screen.getByText('WAITING')).toBeInTheDocument();
    expect(screen.getByText('Awaiting server response')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    expect(screen.getByText('Response received')).toBeInTheDocument();
    expect(screen.getByText('ERROR')).toBeInTheDocument();
    expect(screen.getByText('Request failed or timed out')).toBeInTheDocument();
  });

  it('announces progress politely and marks only the current stage as active', () => {
    const { container } = render(<RequestPipeline currentStage={PIPELINE_STAGE_WAITING} />);

    const pipeline = container.querySelector('.request-pipeline');
    const activeStage = container.querySelector('[aria-current="step"]');
    const activeStages = container.querySelectorAll('.request-pipeline-stage-active');

    expect(pipeline).toHaveAttribute('aria-live', 'polite');
    expect(activeStage).toHaveTextContent('WAITING');
    expect(activeStage).toHaveClass('request-pipeline-stage-active');
    expect(activeStages).toHaveLength(1);
  });

  it('applies the expected stage-specific styling classes', () => {
    const { container } = render(<RequestPipeline currentStage={PIPELINE_STAGE_SUCCESS} />);

    expect(container.querySelector('.request-pipeline-stage-idle')).toHaveTextContent('IDLE');
    expect(container.querySelector('.request-pipeline-stage-sending')).toHaveTextContent('SENDING');
    expect(container.querySelector('.request-pipeline-stage-waiting')).toHaveTextContent('WAITING');
    expect(container.querySelector('.request-pipeline-stage-success')).toHaveTextContent('SUCCESS');
    expect(container.querySelector('.request-pipeline-stage-error')).toHaveTextContent('ERROR');
  });
});
