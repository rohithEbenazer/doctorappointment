import React from 'react';
import { CheckCircle2, Clock, XCircle, CheckCheck } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'CONFIRMED':
      return (
        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} />
          Confirmed
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCheck size={12} />
          Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <XCircle size={12} />
          Cancelled
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          Pending
        </span>
      );
  }
};
