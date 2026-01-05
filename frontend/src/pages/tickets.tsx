import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FiPlus } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import SupportFab from '@/components/ai/SupportFab';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import TicketFormModal from '@/components/forms/TicketFormModal';
import styles from '@/styles/Tickets.module.css';

const Tickets: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Head>
        <title>Tickets - SupportHub</title>
      </Head>
      <AppLayout>
        <div className={styles.pageHeaderStacked}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>Tickets</h1>
              <p className={styles.pageSubtitle}>Manage and track support incidents</p>
            </div>
          </div>
          <button className={styles.primaryButtonFull} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={18} />
            Create Ticket
          </button>
        </div>

        <div className={styles.kanbanContainer}>
          <KanbanBoard key={refreshKey} />
        </div>

        <TicketFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTicketCreated}
        />

        <SupportFab />
      </AppLayout>
    </>
  );
};

export default Tickets;