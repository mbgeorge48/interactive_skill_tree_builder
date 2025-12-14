import { useState, useEffect, useRef } from "react";
import "./Modal.css";

export function Modal({ isOpen, onClose, onSubmit }) {
    const dialogRef = useRef(null);

    const getInitialFormData = () => ({
        skillName: "",
        description: "",
        cost: "1",
        category: "movement",
    });

    const [formData, setFormData] = useState(getInitialFormData);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(getInitialFormData());
        onClose();
    };

    const handleCancel = () => {
        setFormData(getInitialFormData());
        onClose();
    };

    const handleDialogClick = (e) => {
        if (e.target === dialogRef.current) {
            handleCancel();
        }
    };

    return (
        <dialog ref={dialogRef} className="modal" onClick={handleDialogClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add New Skill</h3>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={handleCancel}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="skillName">
                                Skill Name<span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="skillName"
                                name="skillName"
                                value={formData.skillName}
                                onChange={(e) =>
                                    handleInputChange(
                                        "skillName",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter skill name..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter skill description..."
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cost">
                                Skill Point Cost
                                <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="cost"
                                name="cost"
                                value={formData.cost}
                                onChange={(e) =>
                                    handleInputChange("cost", e.target.value)
                                }
                                min={1}
                                max={10}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                    handleInputChange(
                                        "category",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="movement">Movement</option>
                                <option value="combat">Combat</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Skill
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
