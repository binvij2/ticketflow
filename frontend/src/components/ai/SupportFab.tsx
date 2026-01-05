import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import styles from '@/styles/SupportFab.module.css';

const SupportFab: React.FC = () => {
  return (
    <button className={styles.fab} title="Help & Support">
      <FiHelpCircle />
    </button>
  );
};

export default SupportFab;