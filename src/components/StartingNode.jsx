import { Position, Handle } from "@xyflow/react";

export function StartingNode() {
    return (
        <div className="starting-node nodrag">
            <div className="skill-header">
                <h3 className="skill-title">Starting Point</h3>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                style={{ visibility: "hidden" }}
            />
        </div>
    );
}
