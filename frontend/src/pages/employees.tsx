import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FiPlus, FiSearch } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import SupportFab from '@/components/ai/SupportFab';
import EmployeeFormModal from '@/components/forms/EmployeeFormModal';
import apiClient from '@/lib/api';
import styles from '@/styles/Tickets.module.css';

interface Employee {
  id: number;
  name: string;
  email: string;
  department?: string;
  created_at: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
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

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.department && employee.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Employees - SupportHub</title>
      </Head>
      <AppLayout>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Employees</h1>
            <p className={styles.pageSubtitle}>Manage organization employees</p>
          </div>
          <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={18} />
            Add Employee
          </button>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search employees..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className={styles.emptyState}>No employees found</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{getInitials(employee.name)}</div>
                        <span className={styles.userName}>{employee.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {employee.email}
                    </td>
                    <td>
                      {employee.department ? (
                        <span className={`${styles.statusBadge} ${styles.statusInProgress}`}>
                          {employee.department}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>-</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(employee.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <EmployeeFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchEmployees}
        />

        <SupportFab />
      </AppLayout>
    </>
  );
};

export default Employees;