import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) =>
    `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

interface WelcomeHeroCardProps {
    /** Logo text (e.g. "trAIn") - "AI" will be highlighted in accent color */
    title?: string;
    /** Tagline text below logo */
    body?: string;
}

/**
 * WelcomeHeroCard — Displays app logo and tagline for welcome screen.
 * 
 * DSL usage:
 *   welcome-hero|trAIn|Where growth meets opportunity.
 * 
 * The word "AI" (case-insensitive) in title is automatically highlighted
 * in the accent color to match Figma design (node 6958-18171).
 */
export const WelcomeHeroCard: React.FC<WelcomeHeroCardProps> = ({ 
    title = 'trAIn', 
    body = 'Where growth meets opportunity.' 
}) => {
    // Parse logo text to highlight "AI" in accent color
    const logoMatch = title.match(/^(.+?)(AI)(.+?)$/i);
    const logoParts = logoMatch 
        ? { before: logoMatch[1], ai: logoMatch[2], after: logoMatch[3] }
        : { before: title, ai: '', after: '' };

    return (
        <div className="flex flex-col items-center gap-3 text-center h-full justify-center">
            {/* Logo — Figma node 6958-18171 */}
            <h1
                className="font-bold tracking-tight leading-none text-white select-none"
                style={{ fontSize: "clamp(72px, 22vw, 96px)" }}
            >
                {logoParts.before}
                {logoParts.ai && (
                    <span style={{ color: "var(--accent-strong)" }}>{logoParts.ai}</span>
                )}
                {logoParts.after}
            </h1>

            {/* Tagline — Figma node 6958-18172 */}
            <p
                className="text-lg sm:text-xl font-normal"
                style={{ color: "var(--text-muted)" }}
            >
                {body}
            </p>
        </div>
    );
};

export default WelcomeHeroCard;
