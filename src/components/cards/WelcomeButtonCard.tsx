import React from 'react';
import { ArrowRight } from 'lucide-react';
import { informTele } from '@/utils/teleUtils';

interface WelcomeButtonCardProps {
    /** Button label text */
    label?: string;
    /** Action signal to send when clicked */
    action?: string;
}

/**
 * WelcomeButtonCard — Action button for welcome screen.
 * 
 * DSL usage:
 *   welcome-button|Begin|start
 * 
 * Matches Figma design (node 6958-18173).
 * When clicked, sends "user clicked: <action>" signal to the AI.
 */
export const WelcomeButtonCard: React.FC<WelcomeButtonCardProps> = ({ 
    label = 'Begin',
    action = 'begin'
}) => {
    const handleClick = () => {
        informTele(`user clicked: ${action}`);
    };

    return (
        <div className="flex flex-col items-center justify-end h-full pb-[calc(80px+env(safe-area-inset-bottom,0px))]">
            <button
                onClick={handleClick}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base shadow-lg transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
                style={{
                    background: "var(--accent)",
                    color: "#18181b",
                    boxShadow: "0 4px 24px rgba(29,197,88,0.3)",
                }}
            >
                {label}
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

export default WelcomeButtonCard;
