import { DragOverlay, useDraggable } from "@dnd-kit/core";
import "../Dashboard.css";
import { useEffect } from "react";
import Cookies from "js-cookie";

export function KanbanItem({ children, id, data}) {
  const token = Cookies.get("userid");
  //console.log(data?.users[0]?.id, token, data?.users[0]?.id != token);
    
    const { attributes, listeners, setNodeRef, active } = useDraggable({
        id,
        data,
        disabled: !(data?.users[0]?.id == token  ||  data?.stageId == 'unassigned'),
    });
    // useEffect(() => {
    //     console.log(data?.users[0]?.id, user?.id);
    // }, [user]);

    return (
        <div className="kanban-item-container">
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className="kanban-item"
                style={{
                    opacity: active ? (active.id === id ? 1 : 0.5) : 1,
                }}
            >
                {children}
            </div>
            {active?.id === id && (
                <DragOverlay zIndex={1000}>
                    <div className="kanban-item-overlay">{children}</div>
                </DragOverlay>
            )}
        </div>
    );
}
