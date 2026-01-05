import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FiUser, FiUserCheck } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/KanbanBoard.module.css';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  employee_id: number;
  engineer_id?: number;
  employee?: { name: string };
  engineer?: { name: string };
}

interface KanbanData {
  [key: string]: Ticket[];
}

const STATUSES = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

const KanbanBoard: React.FC = () => {
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    open: [],
    in_progress: [],
    resolved: [],
    closed: [],
  });

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const fetchKanbanData = async () => {
    try {
      const response = await apiClient.get('/api/tickets/kanban');
      setKanbanData(response.data);
    } catch (error) {
      console.error('Error fetching kanban data:', error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = kanbanData[source.droppableId];
    const destColumn = kanbanData[destination.droppableId];
    const ticket = sourceColumn.find(t => t.id.toString() === draggableId);

    if (!ticket) return;

    const newSourceColumn = Array.from(sourceColumn);
    newSourceColumn.splice(source.index, 1);

    const newDestColumn = Array.from(destColumn);
    newDestColumn.splice(destination.index, 0, { ...ticket, status: destination.droppableId });

    setKanbanData({
      ...kanbanData,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn,
    });

    try {
      await apiClient.patch(`/api/tickets/${ticket.id}/status`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      fetchKanbanData();
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {STATUSES.map((status) => (
          <div key={status.key} className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnTitle}>{status.label}</span>
              <span className={styles.columnCount}>{kanbanData[status.key]?.length || 0}</span>
            </div>
            <Droppable droppableId={status.key}>
              {(provided) => (
                <div
                  className={styles.columnContent}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {kanbanData[status.key]?.map((ticket, index) => (
                    <Draggable key={ticket.id} draggableId={ticket.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.ticketCard} ${snapshot.isDragging ? styles.dragOverlay : ''}`}
                        >
                          <div className={styles.ticketHeader}>
                            <span className={styles.ticketId}>#{ticket.id}</span>
                            <span className={`${styles.priorityBadge} ${getPriorityClass(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <div className={styles.ticketTitle}>{ticket.title}</div>
                          <div className={styles.ticketDescription}>{ticket.description}</div>
                          <div className={styles.ticketFooter}>
                            <div className={styles.ticketEmployee}>
                              <FiUser size={14} />
                              <span>{ticket.employee?.name || 'Unknown'}</span>
                            </div>
                            <div className={styles.ticketEngineer}>
                              {ticket.engineer ? (
                                <>
                                  <div className={styles.engineerAvatar}>
                                    {getInitials(ticket.engineer.name)}
                                  </div>
                                </>
                              ) : (
                                <span className={styles.unassignedBadge}>Unassigned</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;