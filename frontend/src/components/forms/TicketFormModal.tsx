import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/FormModal.module.css';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface Engineer {
  id: number;
  name: string;
  email: string;
}

const TicketFormModal: React.FC<TicketFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    employee_id: '',
    engineer_id: '',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchEngineers();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/api/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchEngineers = async () => {
    try {
      const response = await apiClient.get('/api/engineers');
      setEngineers(response.data);
    } catch (err) {
      console.error('Error fetching engineers:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        employee_id: parseInt(formData.employee_id),
        engineer_id: formData.engineer_id ? parseInt(formData.engineer_id) : null,
      };
      await apiClient.post('/api/tickets', payload);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
        employee_id: '',
        engineer_id: '',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create Ticket</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Priority *</label>
            <select
              className={styles.select}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Requester (Employee) *</label>
            <select
              className={styles.select}
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Assign to Engineer (Optional)</label>
            <select
              className={styles.select}
              value={formData.engineer_id}
              onChange={(e) => setFormData({ ...formData, engineer_id: e.target.value })}
            >
              <option value="">Unassigned</option>
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name} ({eng.email})
                </option>
              ))}
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.modalFooter}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketFormModal;