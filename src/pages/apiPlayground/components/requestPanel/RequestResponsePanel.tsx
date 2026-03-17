const RequestResponsePanel = ({ responseData }: { responseData: string }) => {
  return (
    <section className="request-form-panel">
      <div className="request-form-panel-header">
        <h3>Request Pipeline</h3>
      </div>
      <pre className="response-output">{responseData}</pre>
    </section>
  );
};

export default RequestResponsePanel;
