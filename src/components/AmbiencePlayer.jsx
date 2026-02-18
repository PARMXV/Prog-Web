import React, { useState } from 'react';
import { FaCloudRain } from 'react-icons/fa';
import SoundManager from '../utils/SoundManager';

const AmbiencePlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAmbience = () => {
        const newState = !isPlaying;
        setIsPlaying(newState);
        SoundManager.toggleNoise(newState);
    };

    return (
        <div className="ambience-control">
            <button
                className={`btn-ambience ${isPlaying ? 'active' : ''}`}
                onClick={toggleAmbience}
                title="Toggle Ambient Noise"
            >
                <FaCloudRain />
                {isPlaying && <span className="status-dot"></span>}
            </button>
            <span>Ambient Noise</span>
        </div>
    );
};

export default AmbiencePlayer;
