import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiFileText, FiUsers, FiUserCheck, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import styles from '@/styles/AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { label: 'Tickets', icon: FiFileText, path: '/tickets' },
    { label: 'Engineers', icon: FiUserCheck, path: '/engineers' },
    { label: 'Employees', icon: FiUsers, path: '/employees' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <button 
          className={styles.menuButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div 
          className={`${styles.backdrop} ${sidebarOpen ? styles.backdropVisible : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarVisible : ''}`}>
          <div className={styles.brandBlock}>
            <div className={styles.logo}>SH</div>
            <div className={styles.brandName}>SupportHub</div>
          </div>

          <nav className={styles.navList}>
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}>
                  <item.icon className={styles.navIcon} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <div className={styles.userFooter}>
            <div className={styles.userAvatar}>
              {user?.username.substring(0, 2).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.username}</div>
              <div className={styles.userRole}>Administrator</div>
            </div>
            <button className={styles.logoutButton} onClick={logout} title="Logout">
              <FiLogOut size={18} />
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentInner}>
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AppLayout;