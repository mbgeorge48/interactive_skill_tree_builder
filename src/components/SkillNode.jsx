import { Position, Handle } from "@xyflow/react";

export function SkillNode(props) {
    const { data } = props;

    return (
        <div
            className={`skill-node nodrag${
                data.selected ? " selected-skill-node" : ""
            }`}
            onClick={() => data.handleSkillNodeClick(props.id)}
        >
            <div className="skill-header">
                <h3 className="skill-title">{data.label}</h3>
                <div className="skill-cost">{data.cost} SP</div>
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
