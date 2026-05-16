import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <h2 className="font-semibold text-2xl">페이지를 찾을 수 없습니다.</h2>
            <Link className="text-blue-600 underline-offset-4 hover:underline" href="/">
                홈으로 이동
            </Link>
        </main>
    );
}
