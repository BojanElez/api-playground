import Footer from '../../layout/footer/Footer';
import Header from '../../layout/header/Header';
import Title from '../../layout/title/Title';
import { useAuthStore } from '../../store/authStore';
import Widget from '../../components/common/widget/Widget';
import AppLayout from '../../layout/appLayout/AppLayout';
import { Link, useParams } from 'react-router-dom';
import { getInitialRequests } from '../apiPlayground/ApiPlayground.utils';
import './RequestDetail.css';
import Button from '../../components/common/button/Button';
import type { TThemeName } from '../../theme/themes';
import Badge from '../apiPlayground/components/badge/Badge';

interface RequestDetailsProps {
  theme: TThemeName;
  onThemeChange: (theme: TThemeName) => void;
}

const RequestDetails = ({ theme, onThemeChange }: RequestDetailsProps) => {
  const { user } = useAuthStore();
  const { requestId } = useParams<{ requestId: string }>();
  const request = getInitialRequests().find((item) => item.id === requestId);

  return (
    <>
      <Header
        userName={user?.name}
        userPicture={user?.picture}
        theme={theme}
        onThemeChange={onThemeChange}
      />
      <AppLayout>
        <Title title="Inspect request detail" />
        <Widget
          title="Request details"
          isEmpty={!request}
          emptyContent={
            <div className="request-details-empty">
              <p>Request not found.</p>
              <Link to="/api-playground" className="request-details-back-link">
                <Button text="Back to request list"></Button>
              </Link>
            </div>
          }
        >
          {request && (
            <div className="request-details-content">
              <div className="request-details-meta">
                <Badge type="state" value={request.requestState} />
                <Badge type="method" value={request.method} />
                <span className="request-details-date">
                  {new Date(request.createdAt).toLocaleString()}
                </span>
              </div>
              <>
                <p>Status Code: {request.statusCode}</p>
              </>
              <>
                <p>Content Type: {request.contentType}</p>
              </>
              <div className="request-details-field">
                <h3>URL</h3>
                <p>{request.url}</p>
              </div>

              {request.body && (
                <div className="request-details-field">
                  <h3>Body</h3>
                  <pre>{request.body || 'No request body.'}</pre>
                </div>
              )}

              <Link to="/api-playground" className="request-details-back-link">
                <Button text="Back to request list"></Button>
              </Link>
            </div>
          )}
        </Widget>
      </AppLayout>
      <Footer name="Develop by RequestDetails" />
    </>
  );
};

export default RequestDetails;
