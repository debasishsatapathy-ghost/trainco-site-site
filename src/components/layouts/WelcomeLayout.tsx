import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { LayoutProps } from './types';
import { informTele } from '@/utils/teleUtils';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) =>
    `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

/**
 * WelcomeLayout — Landing screen with logo, tagline, and begin button.
 *
 * DSL usage:
 *   LAYOUT|layout:welcome
 *   welcome-hero|trAIn|Where growth meets opportunity.
 *   welcome-button|Begin|start
 *
 * The first card provides logo text and tagline.
 * The second card provides button label and action signal.
 * 
 * Matches Figma designs:
 * - Node 6958-18169: Background container
 * - Node 6958-18171: Logo "trAIn" (AI in green)
 * - Node 6958-18172: Tagline
 * - Node 6958-18173: Begin button
 */
export const WelcomeLayout: React.FC<LayoutProps> = ({ cards = [] }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Extract data from cards
    const heroCard = cards.find(c => c.type === 'welcome-hero') || cards[0];
    const buttonCard = cards.find(c => c.type === 'welcome-button') || cards[1];

    // Parse logo text (default "trAIn" with AI highlighted)
    const logoText = (heroCard?.title || heroCard?.label || 'trAIn') as string;
    const logoMatch = logoText.match(/^(.+?)(AI)(.+?)$/i);
    const logoParts = logoMatch 
        ? { before: logoMatch[1], ai: logoMatch[2], after: logoMatch[3] }
        : { before: logoText, ai: '', after: '' };

    const tagline = heroCard?.body || heroCard?.subtitle || heroCard?.detail || 
                   'Where growth meets opportunity.';
    
    const buttonLabel = buttonCard?.label || buttonCard?.title || 'Begin';
    const buttonAction = buttonCard?.action || buttonCard?.value || 'begin';

    const handleBegin = () => {
        informTele(`user clicked: ${buttonAction}`);
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden flex flex-col"
            style={{ background: "var(--bg)" }}
        >
            {/* Green radial background glow — matches Figma node 6958-18169 */}
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 120% 80% at 50% 60%, rgba(16,42,40,0.55) 0%, rgba(16,42,40,0.15) 55%, transparent 80%)",
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 540,
                    height: 640,
                    top: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background:
                        "radial-gradient(ellipse at center, rgba(30,210,94,0.13) 0%, transparent 65%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Logo + tagline — centered vertically */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                <motion.div
                    initial={false}
                    animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-3 text-center"
                >
                    {/* trAIn wordmark — Figma node 6958-18171 */}
                    <h1
                        className="font-bold tracking-tight leading-none text-white select-none"
                        style={{ fontSize: "clamp(72px, 22vw, 96px)" }}
                    >
                        {logoParts.before}
                        <span style={{ color: "var(--accent-strong)" }}>{logoParts.ai}</span>
                        {logoParts.after}
                    </h1>

                    {/* Tagline — Figma node 6958-18172 */}
                    <p
                        className="text-lg sm:text-xl font-normal"
                        style={{ color: "var(--text-muted)" }}
                    >
                        {tagline}
                    </p>
                </motion.div>
            </div>

            {/* Begin button — Figma node 6958-18173 */}
            <div className="relative z-10 flex flex-col items-center pb-[calc(80px+env(safe-area-inset-bottom,0px))]">
                <motion.button
                    initial={false}
                    animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onClick={handleBegin}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base shadow-lg transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
                    style={{
                        background: "var(--accent)",
                        color: "#18181b",
                        boxShadow: "0 4px 24px rgba(29,197,88,0.3)",
                    }}
                >
                    {buttonLabel}
                    <ArrowRight size={16} />
                </motion.button>
            </div>
        </div>
    );
};

export default WelcomeLayout;
