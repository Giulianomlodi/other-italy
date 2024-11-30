// PhaseStatus.tsx
import React from 'react';

interface PhaseStatusProps {
    isActive: boolean;
    phase: 'whitelist' | 'public';
}

export const PhaseStatus: React.FC<PhaseStatusProps> = ({ isActive, phase }) => {
    const getStatusText = () => {
        if (isActive) {
            return "Active Now";
        }
        return phase === 'whitelist' ? "Not Started" : "Coming Soon";
    };

    return (
        <p className={`
            text-sm mt-2
            ${isActive ? 'text-green-400' : 'text-blue-300'}
        `}>
            {getStatusText()}
        </p>
    );
};