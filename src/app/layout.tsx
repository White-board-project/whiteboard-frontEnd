import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'Whiteboard',
    description: '실시간 에디터 공유 플랫폼 화이트보드 프론트엔드',
};

type RootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="ko">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
