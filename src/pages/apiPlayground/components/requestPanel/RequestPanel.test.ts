import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createElement } from 'react';
import RequestResponsePanel from './RequestResponsePanel';

const renderPanel = (responseData: string) =>
  render(createElement(RequestResponsePanel, { responseData }));

describe('RequestResponsePanel', () => {
  it('renders the panel heading', () => {
    renderPanel('{}');

    expect(screen.getByRole('heading', { name: 'Request Pipeline' })).toBeInTheDocument();
  });

  it('renders provided response data', () => {
    const response = '{"status":"ok"}';
    renderPanel(response);

    expect(screen.getByText(response)).toBeInTheDocument();
  });

  it('renders multiline response text inside preformatted block', () => {
    const multiline = '{\n  "status": "ok",\n  "count": 2\n}';
    const { container } = renderPanel(multiline);

    const output = container.querySelector('pre.response-output');
    expect(output).toBeInTheDocument();
    expect(output?.textContent).toBe(multiline);
  });

  it('applies expected layout classes', () => {
    const { container } = renderPanel('response');

    expect(container.querySelector('section.request-form-panel')).toBeInTheDocument();
    expect(container.querySelector('.request-form-panel-header')).toBeInTheDocument();
    expect(container.querySelector('.response-output')).toBeInTheDocument();
  });

  it('renders empty output when response data is empty', () => {
    const { container } = renderPanel('');

    const output = container.querySelector('pre.response-output');
    expect(output).toBeInTheDocument();
    expect(output).toHaveTextContent('');
  });
});
