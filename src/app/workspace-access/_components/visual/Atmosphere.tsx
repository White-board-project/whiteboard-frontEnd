export function Atmosphere() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 top-[-7rem] h-80 w-80 rounded-full bg-primary-fixed-dim/45 blur-3xl" />
            <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-tertiary-fixed/55 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed/20 blur-3xl" />
        </div>
    );
}
