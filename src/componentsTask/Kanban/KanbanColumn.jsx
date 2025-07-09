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

    const getColumnIcon = () => {
        switch (title.toLowerCase()) {
            case 'pending':
                return '⏳';
            case 'in progress':
            case 'in-progress':
                return '⚡';
            case 'completed':
                return '✅';
            case 'review':
                return '👀';
            default:
                return '📋';
        }
    };

    return (
        <div className="kanban-column" ref={setNodeRef}>
            <div className="kanban-column-header">
                <div className="kanban-column-title-row">
                    <div className="kanban-column-title-group">
                        <span className="column-icon">{getColumnIcon()}</span>
                        <span className="kanban-column-title" title={title}>
                            {title}
                        </span>
                        {count !== undefined && (
                            <span className="kanban-column-badge">{count}</span>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`kanban-column-content${isOver ? " over" : ""}`}
                style={{
                    overflowY: active ? "unset" : "auto",
                }}
            >
                <div className="kanban-column-items">{children}</div>
            </div>
        </div>
    );
}