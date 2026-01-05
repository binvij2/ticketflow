import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FiPlus, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import SupportFab from '@/components/ai/SupportFab';
import EngineerFormModal from '@/components/forms/EngineerFormModal';
import apiClient from '@/lib/api';
import styles from '@/styles/Tickets.module.css';

interface Engineer {
  id: number;
  name: string;
  email: string;
  specialization?: string;
  is_active: boolean;
  created_at: string;
}

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      const response = await apiClient.get('/api/engineers');
      setEngineers(response.data);
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredEngineers = engineers.filter(engineer => 
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (engineer.specialization && engineer.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Engineers - SupportHub</title>
      </Head>
      <AppLayout>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Engineers</h1>
            <p className={styles.pageSubtitle}>Manage support engineering team</p>
          </div>
          <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={18} />
            Add Engineer
          </button>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search engineers..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredEngineers.length === 0 ? (
            <div className={styles.emptyState}>No engineers found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Engineer</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredEngineers.map((engineer) => (
                  <tr key={engineer.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{getInitials(engineer.name)}</div>
                        <span className={styles.userName}>{engineer.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {engineer.email}
                    </td>
                    <td>
                      {engineer.specialization ? (
                        <span className={`${styles.statusBadge} ${styles.statusInProgress}`}>
                          {engineer.specialization}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>-</span>
                      )}
                    </td>
                    <td>
                      {engineer.is_active ? (
                        <span className={`${styles.statusBadge} ${styles.statusResolved}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FiCheckCircle size={12} />
                          Active
                        </span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusClosed}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FiXCircle size={12} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(engineer.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <EngineerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchEngineers}
        />

        <SupportFab />
      </AppLayout>
    </>
  );
};

export default Engineers;