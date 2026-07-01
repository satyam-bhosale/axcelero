export function AlternateAuthDivider() {
    return (
        <div className="w-full flex flex-row items-center gap-3 px-5">
            <div className="flex-1 h-px bg-muted-foreground/30" />
            <div className="text-sm text-muted-foreground/50">
                OR
            </div>
            <div className="flex-1 h-px bg-muted-foreground/30" />
        </div>
    )
}