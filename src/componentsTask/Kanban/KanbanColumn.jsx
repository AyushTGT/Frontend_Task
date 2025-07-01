import { useDroppable } from "@dnd-kit/core";
import "../Dashboard.css";

export function KanbanColumn({
    children,
    id,
    title,
    description,
    count,
    data,
    onAddClick,
}) {
    const { isOver, setNodeRef, active } = useDroppable({
        id,
        data,
    });

    // const onAddClickHandler = () => {
    //     if (onAddClick) onAddClick({ id });
    // };

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
                {description && (
                    <div className="kanban-column-description">
                        {description}
                    </div>
                )}
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

// export function KanbanColumnSkeleton({ children }) {
//     return (
//         <div className="kanban-column">
//             <div className="kanban-column-header">
//                 <div className="kanban-column-title-row">
//                     <div className="kanban-column-title-group">
//                         <div
//                             className="kanban-column-title skeleton"
//                             style={{ width: "125px" }}
//                         />
//                     </div>
//                     <button
//                         className="kanban-column-skeleton-btn"
//                         disabled
//                         type="button"
//                     >
//                         <svg
//                             height="14"
//                             width="14"
//                             style={{ transform: "rotate(90deg)" }}
//                         >
//                             <circle cx="7" cy="7" r="6" fill="#e0e0e0" />
//                         </svg>
//                     </button>
//                     <button
//                         className="kanban-column-add-btn"
//                         disabled
//                         type="button"
//                     >
//                         +
//                     </button>
//                 </div>
//             </div>
//             <div className="kanban-column-content">
//                 <div className="kanban-column-items">{children}</div>
//             </div>
//         </div>
//     );
// }
