import React, { useState } from 'react';
import { FaPlus, FaCheck, FaTrash, FaRegCircle, FaCircle } from 'react-icons/fa';

const TaskList = ({ tasks, addTask, toggleTask, deleteTask }) => {
    const [newTask, setNewTask] = useState('');
    const [estimation, setEstimation] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        addTask(newTask, estimation);
        setNewTask('');
        setEstimation(1);
    };

    return (
        <div className="task-container glass-panel">
            <h3>Tasks</h3>
            <form onSubmit={handleSubmit} className="task-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What are you working on?"
                    className="task-input"
                />

                <div className="estimation-input">
                    <span>Est. Pomodoros:</span>
                    <div className="est-circles">
                        {[1, 2, 3, 4, 5].map(num => (
                            <button
                                type="button"
                                key={num}
                                className={`est-btn ${num <= estimation ? 'active' : ''}`}
                                onClick={() => setEstimation(num)}
                            >
                                <FaCircle />
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="add-btn">
                    <FaPlus />
                </button>
            </form>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <div className="task-content" onClick={() => toggleTask(task.id)}>
                            <div className="checkbox">
                                {task.completed && <FaCheck />}
                            </div>
                            <div className="task-text-group">
                                <span>{task.text}</span>
                                <div className="task-est-display">
                                    {[...Array(task.estimation || 1)].map((_, i) => (
                                        <span key={i} className="est-dot"><FaCircle /></span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="delete-btn">
                            <FaTrash />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="empty-state">No tasks yet. Stay focused!</p>
                )}
            </div>
        </div>
    );
};

export default TaskList;
