import React from 'react';
import { FaPlay, FaPause, FaRedo, FaCog } from 'react-icons/fa';

const Timer = ({
    mode,
    timeLeft,
    totalTime,
    isActive,
    onStartPause,
    onReset,
    onOpenSettings
}) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getModeLabel = () => {
        switch (mode) {
            case 'work': return 'Focus';
            case 'shortBreak': return 'Short Break';
            case 'longBreak': return 'Long Break';
            default: return 'Focus';
        }
    };

    // Circular Progress Logic
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

    return (
        <div className="timer-container glass-panel">
            <div className="timer-header">
                <div className="status-badge">{getModeLabel()}</div>
                <button className="settings-btn" onClick={onOpenSettings}>
                    <FaCog />
                </button>
            </div>

            <div className="timer-circle">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="progress-ring"
                >
                    <circle
                        className="progress-ring__circle-bg"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        className="progress-ring__circle"
                        stroke="white"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="time-display-overlay">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="controls">
                <button
                    className={`btn-primary ${isActive ? 'active' : ''}`}
                    onClick={onStartPause}
                >
                    {isActive ? <FaPause /> : <FaPlay />}
                </button>
                <button className="btn-secondary" onClick={onReset}>
                    <FaRedo />
                </button>
            </div>
        </div>
    );
};

export default Timer;
