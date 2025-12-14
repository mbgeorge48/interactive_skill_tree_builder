import { Position, Handle } from "@xyflow/react";
import "./Node.css";

export function SkillNode(props) {
    const { data } = props;

    const handleClick = () => {
        if (data.locked) return;
        data.handleSkillNodeClick(props.id);
    };

    return (
        <div
            className={`skill-node ${
                data.selected ? " selected-skill-node" : ""
            }${data.locked ? " locked-skill-node" : ""}`}
            onClick={handleClick}
            style={{
                opacity: data.locked ? 0.4 : 1,
                cursor: data.locked ? "not-allowed" : "pointer",
            }}
        >
            <div className="skill-header">
                <h3 className="skill-title">{data.label}</h3>
            </div>

            {data.description && (
                <div className="skill-description">{data.description}</div>
            )}

            <div className="skill-category">{data.category}</div>

            <Handle
                type="target"
                position={Position.Top}
                style={{ visibility: "hidden" }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ visibility: "hidden" }}
            />
        </div>
    );
}
