// src/app/layout.js
"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({ children }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });
          if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
              console.log('Service Worker registered: ', registration);
            }).catch(registrationError => {
              console.error('Service Worker registration failed: ', registrationError);
            });
          });
        }
         if (typeof document !== 'undefined') {
             Modal.setAppElement('body');
         }
    }, []);

    const handleAddToHomeScreen = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                console.log('用户接受安装 PWA');
            } else {
                console.log('用户拒绝安装 PWA');
            }
        setDeferredPrompt(null);
        }
    };

    return (
        <html lang="zh">
        <head>
            <link rel="manifest" href="/manifest.json" />
        </head>
            <body className={inter.className}>
                 {children}
                {deferredPrompt && (
                    <button
                        onClick={handleAddToHomeScreen}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            padding: '10px',
                            backgroundColor: '#0055ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        添加到主屏幕
                    </button>
                )}
            </body>
        </html>
    );
}