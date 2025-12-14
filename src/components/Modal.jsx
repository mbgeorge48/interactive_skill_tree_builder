import { useState, useEffect, useRef } from "react";
import "./Modal.css";

export function Modal({ isOpen, onClose, onSubmit, existingNodes }) {
  const dialogRef = useRef(null);

  const getInitialFormData = () => ({
    skillName: "",
    description: "",
    category: "movement",
    prerequisite: "",
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
                onChange={(e) => handleInputChange("skillName", e.target.value)}
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
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter skill description..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="movement">Movement</option>
                <option value="combat">Combat</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prerequisite">Prerequisite</label>
              <select
                id="prerequisite"
                name="prerequisite"
                value={formData.prerequisite}
                onChange={(e) =>
                  handleInputChange("prerequisite", e.target.value)
                }
              >
                {existingNodes?.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
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
