import { useState } from 'react';
import Input from '../../../../components/common/input/Input';
import Button from '../../../../components/common/button/Button';
import Dropdown from '../../../../components/common/dropdown/Dropdown';
import Modal from '../../../../components/modal/Modal';
import Badge from '../badge/Badge';
import type { IRequestItem, TSortOption } from '../../types';
import type { IRequestListProps } from './RequestList.types';
import { Link } from 'react-router-dom';
import './RequestList.css';

const RequestList = ({
  items,
  searchTerm,
  sortBy,
  currentPage,
  totalPages,
  onSearchChange,
  onSortChange,
  onPageChange,
  onDeleteRequest,
}: IRequestListProps) => {
  const [requestToDelete, setRequestToDelete] = useState<IRequestItem | null>(null);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleConfirmDelete = () => {
    if (!requestToDelete) {
      return;
    }

    onDeleteRequest(requestToDelete.id);
    setRequestToDelete(null);
  };

  return (
    <section className="request-list-panel">
      <div className="request-list-header">
        <h3>List of Requests</h3>
        <span className="request-list-counter">
          Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
        </span>
      </div>

      <div className="request-list-tools">
        <Input
          name="requestSearch"
          type="search"
          placeholder="Search by URL, request state or method"
          value={searchTerm}
          size="small"
          onChange={(event: { target: { value: string } }) => onSearchChange(event.target.value)}
        />

        <div className="request-list-sort-wrap">
          <Dropdown
            label="Sort"
            options={[
              { label: 'Failed first', value: 'failed' },
              { label: 'Success first', value: 'success' },
              { label: 'Newest first', value: 'newest' },
              { label: 'Oldest first', value: 'oldest' },
              { label: 'Method A-Z', value: 'method-asc' },
              { label: 'Method Z-A', value: 'method-desc' },
            ]}
            value={sortBy}
            onChange={(val: string) => onSortChange(val as TSortOption)}
          />
        </div>
      </div>

      <ul className="request-list-items">
        {items.map((item) => (
          <li className="request-list-item" key={item.id}>
            <div className="request-list-item-top">
              <Badge type="state" value={item.requestState} />
              <Badge type="method" value={item.method} />
              <span className="request-list-date">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <div className="request-list-url">{item.url}</div>
            <div className="d-flex">
              <Link to={`/api-playground/requests/${item.id}`} className="request-list-link">
                View details
              </Link>
              <Button
                text="Delete"
                size="small"
                variant="danger"
                className="request-list-delete-button"
                onClick={() => setRequestToDelete(item)}
              />
            </div>
          </li>
        ))}
      </ul>
      {totalPages === 0 && <div className="request-list-pagination">No requests to display.</div>}
      {totalPages > 1 && (
        <div className="request-list-pagination">
          <Button
            text="Previous"
            variant="secondary"
            size="small"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          <div className="request-list-pagination-pages" aria-label="Pagination pages">
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                text={`${pageNumber}`}
                size="small"
                variant="secondary"
                className={
                  pageNumber === currentPage
                    ? 'request-list-page-button request-list-page-button--active'
                    : 'request-list-page-button'
                }
                onClick={() => onPageChange(pageNumber)}
              />
            ))}
          </div>
          <Button
            text="Next"
            variant="secondary"
            size="small"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </div>
      )}

      <Modal
        isOpen={requestToDelete !== null}
        title="Delete request"
        message="Are you sure you want to delete this request?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirmDelete}
        onCancel={() => setRequestToDelete(null)}
      />
    </section>
  );
};

export default RequestList;
