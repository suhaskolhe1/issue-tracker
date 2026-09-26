import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { type Issue } from '../features/issues/issueService.ts';
import { Link } from 'react-router-dom';

// The columns we want on our board
const COLUMNS = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' }
];

interface KanbanBoardProps {
    issues: Issue[];
    onStatusChange: (issueId: number, newStatus: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ issues, onStatusChange }) => {

    // This function fires the exact moment the user drops a card
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // 1. If they dropped it outside a column, do nothing.
        if (!destination) return;

        // 2. If they dropped it in the exact same spot, do nothing.
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // 3. Otherwise, trigger the API update!
        // The draggableId is our Issue ID, and the droppableId is the New Status!
        onStatusChange(Number(draggableId), destination.droppableId);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full items-start">

                {COLUMNS.map((column) => (
                    <div key={column.id} className="flex-1 min-w-[300px] max-w-sm bg-stone-100/50 border border-stone-200 rounded-sm p-4 flex flex-col h-full">
                        <h3 className="font-semibold text-stone-900 mb-4">{column.title}</h3>

                        <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex-1 flex flex-col gap-3 min-h-[150px] transition-colors ${
                                        snapshot.isDraggingOver ? 'bg-stone-200/50 rounded-sm' : ''
                                    }`}
                                >
                                    {/* Filter issues so only the ones for THIS column appear here */}
                                    {issues
                                        .filter((issue) => issue.status === column.id)
                                        .map((issue, index) => (
                                            <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white border p-4 rounded-sm shadow-sm transition-all ${
                                                            snapshot.isDragging ? 'shadow-lg border-accent ring-1 ring-accent' : 'border-stone-200 hover:border-stone-300'
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Link to={`/issues/${issue.id}`} className="font-medium text-stone-900 hover:text-accent transition-colors line-clamp-2">
                                                                {issue.title}
                                                            </Link>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-4">
                              <span className="text-xs font-semibold px-2 py-1 bg-stone-100 text-stone-600 rounded-sm">
                                {issue.issueKey}
                              </span>
                                                            <span className="text-xs font-medium text-stone-500">
                                {issue.priority}
                              </span>
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
