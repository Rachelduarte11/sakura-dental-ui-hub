import React from 'react';
import List from './ListService';
import { Service } from '../api/types';

interface Props {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export const ServiceList: React.FC<Props> = ({ services, onEdit, onDelete, onToggleStatus }) => (
  <div className="px-4 py-2">
    <List
      services={services}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
    />
  </div>
); 