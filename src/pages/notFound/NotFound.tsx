import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-message">Page Not Found. Alert, you are looking for wrong hook</h2>
      <p className="not-found-description">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/login" className="not-found-link">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
