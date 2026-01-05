import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FiFileText, FiUsers, FiUserCheck, FiClock, FiPlus } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import KpiCard from '@/components/dashboard/KpiCard';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import SupportFab from '@/components/ai/SupportFab';
import TicketFormModal from '@/components/forms/TicketFormModal';
import apiClient from '@/lib/api';
import styles from '@/styles/Dashboard.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  total_engineers: number;
  total_employees: number;
  avg_resolution_time: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    resolved_tickets: 0,
    total_engineers: 0,
    total_employees: 0,
    avg_resolution_time: '0h',
  });
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ticketsRes, engineersRes, employeesRes] = await Promise.all([
        apiClient.get('/api/tickets'),
        apiClient.get('/api/engineers'),
        apiClient.get('/api/employees'),
      ]);

      const tickets = ticketsRes.data;
      const engineers = engineersRes.data;
      const employees = employeesRes.data;

      const openTickets = tickets.filter((t: any) => t.status === 'open').length;
      const inProgressTickets = tickets.filter((t: any) => t.status === 'in_progress').length;
      const resolvedTickets = tickets.filter((t: any) => t.status === 'resolved').length;

      setStats({
        total_tickets: tickets.length,
        open_tickets: openTickets,
        in_progress_tickets: inProgressTickets,
        resolved_tickets: resolvedTickets,
        total_engineers: engineers.length,
        total_employees: employees.length,
        avg_resolution_time: '2.5h',
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statusData = [
    { name: 'Open', value: stats.open_tickets, color: '#FF5C5C' },
    { name: 'In Progress', value: stats.in_progress_tickets, color: '#F59E0B' },
    { name: 'Resolved', value: stats.resolved_tickets, color: '#22B8A7' },
  ];

  const priorityData = [
    { name: 'High', value: 12, color: '#EF4444' },
    { name: 'Medium', value: 24, color: '#F59E0B' },
    { name: 'Low', value: 18, color: '#10B981' },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - SupportHub</title>
      </Head>
      <AppLayout>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Monitor support tickets and team performance</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.primaryButton} onClick={() => setIsTicketModalOpen(true)}>
              <FiPlus size={18} />
              New Ticket
            </button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          <KpiCard
            label="Total Tickets"
            value={stats.total_tickets}
            subtitle="All time"
            icon={FiFileText}
            color="primary"
          />
          <KpiCard
            label="Open Tickets"
            value={stats.open_tickets}
            subtitle="Needs attention"
            icon={FiClock}
            color="warning"
          />
          <KpiCard
            label="Engineers"
            value={stats.total_engineers}
            subtitle="Active support staff"
            icon={FiUserCheck}
            color="secondary"
          />
          <KpiCard
            label="Employees"
            value={stats.total_employees}
            subtitle="Registered users"
            icon={FiUsers}
            color="accent"
          />
        </div>

        <div className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Tickets by Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Tickets by Priority</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.kanbanSection}>
          <h2 className={styles.sectionTitle}>Ticket Board</h2>
          <KanbanBoard />
        </div>

        <TicketFormModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onSuccess={fetchStats}
        />

        <SupportFab />
      </AppLayout>
    </>
  );
};

export default Dashboard;