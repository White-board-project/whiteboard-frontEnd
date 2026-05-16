'use client';

type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <h2 className="font-semibold text-2xl">문제가 발생했습니다.</h2>
            <p className="max-w-xl text-neutral-600">{error.message}</p>
            <button
                className="rounded-md bg-black px-4 py-2 font-medium text-sm text-white hover:bg-neutral-800"
                onClick={reset}
                type="button"
            >
                다시 시도
            </button>
        </main>
    );
}
