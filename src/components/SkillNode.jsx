import { Position, Handle } from "@xyflow/react";

export function SkillNode(props) {
    const { data } = props;
    return (
        <div className="skill-node nodrag">
            {data.label}
            {/* we're gonna hide the handles and auto make them on press eventually*/}
            <Handle type="source" position={Position.Top} />
            <Handle type="target" position={Position.Bottom} />
        </div>
    );
}
