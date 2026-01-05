import React from 'react';
import { IconType } from 'react-icons';
import styles from '@/styles/KpiCard.module.css';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: IconType;
  color?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'info';
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  label, 
  value, 
  subtitle, 
  icon: Icon,
  color = 'primary' 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={`${styles.iconContainer} ${styles[`iconContainer${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
        <Icon />
      </div>
    </div>
  );
};

export default KpiCard;