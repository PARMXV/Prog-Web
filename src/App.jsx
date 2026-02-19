import React, { useState, useEffect, useRef } from 'react';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import SettingsModal from './components/SettingsModal';
import AmbiencePlayer from './components/AmbiencePlayer';
import SoundManager from './utils/SoundManager';
import { FaLeaf } from 'react-icons/fa';

const App = () => {
    // Settings State
    const [settings, setSettings] = useState({
        work: 25,
        shortBreak: 5,
        longBreak: 15
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Timer State
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(settings.work * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Task State
    const [tasks, setTasks] = useState([]);

    const timerRef = useRef(null);

    // Update timer when settings change
    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        if (!isActive) {
            if (mode === 'work') setTimeLeft(newSettings.work * 60);
            if (mode === 'shortBreak') setTimeLeft(newSettings.shortBreak * 60);
            if (mode === 'longBreak') setTimeLeft(newSettings.longBreak * 60);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(settings[newMode] * 60);
        setIsActive(false);
    };

    const toggleTimer = () => {
        if (!isActive) {
            SoundManager.playStart();
        } else {
            SoundManager.playPause();
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(settings[mode] * 60);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            SoundManager.playComplete();

            if (mode === 'work') {
                setSessionsCompleted(prev => prev + 1);
            }
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, mode]);

    // Task Handlers
    const addTask = (text, estimation) => {
        setTasks([...tasks, { id: Date.now(), text, estimation, completed: false }]);
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => {
            if (t.id === id && !t.completed) {
                SoundManager.playTaskComplete();
            }
            return t.id === id ? { ...t, completed: !t.completed } : t;
        }));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className={`app-container theme-${mode}`}>
            <header className="app-header">
                <div className="logo">
                    <FaLeaf className="logo-icon" />
                    <h1>ZenFocus - Modo Estudio</h1>
                </div>

                <div className="stats-display">
                    <span>Sessions Today: </span>
                    <span className="session-count">{sessionsCompleted}</span>
                </div>

                <nav className="mode-switcher">
                    <button className={mode === 'work' ? 'active' : ''} onClick={() => switchMode('work')}>Focus</button>
                    <button className={mode === 'shortBreak' ? 'active' : ''} onClick={() => switchMode('shortBreak')}>Short</button>
                    <button className={mode === 'longBreak' ? 'active' : ''} onClick={() => switchMode('longBreak')}>Long</button>
                </nav>
            </header>

            <main className="main-content">
                <div className="timer-section">
                    <Timer
                        mode={mode}
                        timeLeft={timeLeft}
                        totalTime={settings[mode] * 60}
                        isActive={isActive}
                        onStartPause={toggleTimer}
                        onReset={resetTimer}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                    />

                    <AmbiencePlayer />
                </div>

                <TaskList
                    tasks={tasks}
                    addTask={addTask}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                />
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSave={handleSaveSettings}
            />
        </div>
    );
};

export default App;
