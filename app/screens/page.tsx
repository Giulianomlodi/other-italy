'use client'

import React from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ScreensPage = () => {
    const screens = [
        { name: '4K Display', filename: '4k.png', description: '3840 x 2160px' },
        { name: 'Full HD', filename: 'Full-hd.png', description: '1920 x 1080px' },
        { name: 'Google Pixel', filename: 'Google-pixel.png', description: 'Latest Pixel resolution' },
        { name: 'iPhone 5', filename: 'iPhone-5.png', description: 'Classic iPhone 5 size' },
        { name: 'iPhone 6/7/8 Plus', filename: 'iPhone6-7-8-plus.png', description: 'Plus models' },
        { name: 'iPhone 6/7/8', filename: 'iPhone6-7-8.png', description: 'Standard models' },
        { name: 'iPhone X', filename: 'iPhoneX.png', description: 'iPhone X resolution' },
        { name: 'Monitor', filename: 'Monitor.png', description: 'Standard monitor size' },
        { name: 'QHD', filename: 'Qhd.png', description: '2560 x 1440px' },
        { name: 'Samsung S10', filename: 'Samsung-s10.png', description: 'Samsung S10 screen' },
        { name: 'Samsung S21/S22 Ultra', filename: 'Samsung-s21-s22-ultra.png', description: 'Ultra models' }
    ];

    const handleDownload = (filename: string) => {
        const encodedFilename = encodeURIComponent(filename);
        const downloadUrl = `/screens/${encodedFilename}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="min-h-screen from-gray-900 to-gray-800 p-6 mt-40">

                <div className="max-w-7xl mx-auto">

                    <h1 className="text-4xl font-bold text-white mb-8 text-center">
                        Download Your Banana Screensaver
                    </h1>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {screens.map((screen) => (
                            <Card key={screen.filename} className="group hover:shadow-lg transition-all duration-300 bg-gray-800 border-gray-700">
                                <CardContent className="p-6">
                                    <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <Image
                                                src={`/screens/${screen.filename}`}
                                                alt={screen.name}
                                                fill
                                                className="object-contain p-2"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                onError={(e) => {
                                                    console.error(`Failed to load image: ${screen.filename}`);
                                                    const imgElement = e.target as HTMLElement;
                                                    imgElement.style.display = 'none';
                                                }}
                                            />
                                            <span className="z-10"></span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-white">{screen.name}</h3>
                                        <p className="text-gray-400">{screen.description}</p>

                                        <Button
                                            onClick={() => handleDownload(screen.filename)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 group-hover:scale-105"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

        </>

    );
};

export default ScreensPage;