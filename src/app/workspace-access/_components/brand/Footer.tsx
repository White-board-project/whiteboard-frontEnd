import { Text } from '@/common/components/ui';
import { footerLinks } from '../../_constants';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="flex flex-col items-center justify-between gap-4 border-outline-variant border-t pt-6 text-on-surface-variant sm:flex-row">
            <Text tone="muted" variant="label-sm">
                © 2024 화이트보드. All rights reserved.
            </Text>
            <nav aria-label="푸터 링크" className="flex flex-wrap justify-center gap-4">
                {footerLinks.map((link) => (
                    <Link className="text-label-sm transition hover:text-on-primary-fixed-variant" href="/" key={link}>
                        {link}
                    </Link>
                ))}
            </nav>
        </footer>
    );
}
