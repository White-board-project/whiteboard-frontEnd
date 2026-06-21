export function MailIcon() {
    return (
        <svg
            aria-hidden
            className="h-14 w-14 text-primary-container"
            fill="none"
            viewBox="0 0 64 64"
        >
            <title>이메일 인증 아이콘</title>
            <rect className="fill-primary-fixed" height="42" rx="10" width="52" x="6" y="14" />
            <path
                d="m10 21 22 17 22-17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
            />
            <path d="M18 46h28" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
            <circle className="fill-tertiary-container" cx="49" cy="15" r="7" />
            <path
                d="m46 15 2.4 2.4L53 12"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}
