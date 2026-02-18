import React, { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    const [formData, setFormData] = useState(settings);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseInt(value, 10)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-group">
                        <label>Focus Duration (min)</label>
                        <input
                            type="number"
                            name="work"
                            value={formData.work}
                            onChange={handleChange}
                            min="1" max="60"
                        />
                    </div>

                    <div className="form-group">
                        <label>Short Break (min)</label>
                        <input
                            type="number"
                            name="shortBreak"
                            value={formData.shortBreak}
                            onChange={handleChange}
                            min="1" max="30"
                        />
                    </div>

                    <div className="form-group">
                        <label>Long Break (min)</label>
                        <input
                            type="number"
                            name="longBreak"
                            value={formData.longBreak}
                            onChange={handleChange}
                            min="1" max="60"
                        />
                    </div>

                    <button type="submit" className="btn-primary save-btn">
                        <FaSave /> Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
