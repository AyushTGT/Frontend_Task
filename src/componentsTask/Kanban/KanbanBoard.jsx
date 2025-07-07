import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import "./Kanban.css"

export function KanbanBoard({ onDragEnd, children }) {
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { distance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event) => {
    if (event.over) {
      onDragEnd(event);
    }
  };

  return (
    <KanbanBoardContainer>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        {children}
      </DndContext>
    </KanbanBoardContainer>
  );
}

export function KanbanBoardContainer({ children }) {
  return (
    <div className="kanban-board-container">
      <div className="kanban-board-inner">
        {children}
      </div>
    </div>
  );
}