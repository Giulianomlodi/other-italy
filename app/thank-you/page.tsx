'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedPatternBackground from '@/components/layout/AnimatedPatternBackground';
import { motion } from 'framer-motion';
import { PartyPopper, Banana } from 'lucide-react';
import SocialTab from '@/components/layout/SocialTab';

export default function ThankYouPage() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Initial setup
        updateDimensions();
        setMounted(true);

        // Add event listener for window resize
        window.addEventListener('resize', updateDimensions);

        // Cleanup
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden py-40">
            <Card className="w-full max-w-2xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 relative z-10">
                <CardContent className="pt-12 pb-8 px-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="relative">
                            <PartyPopper className="h-16 w-16 text-yellow-400" />
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-2 -right-2"
                            >
                                <Banana className="h-8 w-8 text-yellow-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-6"
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome to the Banana Family! 🎉
                        </h1>
                        <p className="text-xl text-white text-opacity-90">
                            Thanks for whitelisting your address.
                        </p>
                        <p className="text-lg text-white text-opacity-80">
                            Get ready for an amazing journey ahead!
                        </p>

                        <div className="py-6">
                            <motion.div
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-2xl font-bold text-yellow-400"
                            >
                                🍌 A Banana future awaits you! 🍌
                            </motion.div>
                        </div>

                        {/* Next Steps Section */}
                        <div className="bg-black/20 rounded-lg p-6 mt-8">
                            <h2 className="text-xl font-semibold text-white mb-4">Next Steps</h2>
                            <ul className="text-white text-opacity-90 space-y-2 text-left">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-400">1.</span>
                                    Join our community to stay updated
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-400">2.</span>
                                    Follow our social media for presale announcements
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-yellow-400">3.</span>
                                    Keep your wallet ready for the upcoming presale
                                </li>
                            </ul>
                        </div>

                        {/* Social Links */}
                        <div className="pt-6">
                            <h3 className="text-white text-opacity-80 mb-4">Join the Community</h3>
                            <SocialTab onItemClick={() => { }} />
                        </div>
                    </motion.div>
                </CardContent>
            </Card>

            {/* Animated background elements */}
            {mounted && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: Math.random() * dimensions.width,
                                y: -20,
                                rotate: 0
                            }}
                            animate={{
                                y: dimensions.height + 20,
                                rotate: 360
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 3
                            }}
                            className="absolute"
                        >
                            <Banana
                                className="h-6 w-6 text-yellow-400 opacity-20"
                                style={{
                                    filter: "blur(1px)"
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatedPatternBackground />
        </div>
    );
}