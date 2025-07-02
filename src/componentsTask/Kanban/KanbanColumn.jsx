import { useDroppable } from "@dnd-kit/core";
import "../Dashboard.css";

export function KanbanColumn({
    children,
    id,
    title,
    count,
    data,
}) {
    const { isOver, setNodeRef, active } = useDroppable({
        id,
        data,
    });

    return (
        <div className="kanban-column" ref={setNodeRef}>
            <div className="kanban-column-header">
                <div className="kanban-column-title-row">
                    <div className="kanban-column-title-group">
                        <span className="kanban-column-title" title={title}>
                            {title}
                        </span>
                        {!!count && (
                            <span className="kanban-column-badge">{count}</span>
                        )}
                    </div>
                   
                </div>
            </div>
            <div
                class={`kanban-column-content${isOver ? " over" : ""}`}
                style={{
                    overflowY: active ? "unset" : "auto",
                }}
            >
                <div className="kanban-column-items">{children}</div>
            </div>
        </div>
    );
}

