import './RequestCountdown.css';

interface IRequestCountdownProps {
  isSubmitting: boolean;
  countdown: number | null;
}

const RequestCountdown = ({ isSubmitting, countdown }: IRequestCountdownProps) => {
  if (!isSubmitting || countdown === null) {
    return null;
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = String(countdown % 60).padStart(2, '0');

  return (
    <div className="request-controls">
      <p className="countdown">
        Timeout in: {minutes}:{seconds}
      </p>
    </div>
  );
};

export default RequestCountdown;
