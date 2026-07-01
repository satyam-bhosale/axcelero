import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/components/card";
import { cn } from "@shadcn/ui/lib/utils";
import { type ComponentProps, type ReactNode } from "react";

type AuthContainerProps = {
    children?: ReactNode;
} & ComponentProps<"div">;

type AuthContainerHeaderProps = {
    children?: ReactNode
} & ComponentProps<'div'>;

type AuthContainerTitleProps = {
    children?: ReactNode
} & ComponentProps<'div'>;

type AuthContainerDescriptionProps = {
    children?: ReactNode
} & ComponentProps<'div'>;

type AuthContainerContentProps = {
    children?: ReactNode
} & ComponentProps<'div'>;

type AuthContainerFooterProps = {
    children?: ReactNode
} & ComponentProps<'div'>;

type AuthContainerFormProps = {
    children?: ReactNode
} & ComponentProps<'form'>;

export function AuthContainer({
    children,
    className,
    ...props
}: AuthContainerProps) {
    return (
        <Card size="default" className={cn("w-full lg:w-md", className)} {...props}>
            {children}
        </Card>
    );
}

export function AuthContainerHeader({ children, ...props }: AuthContainerHeaderProps) {
    return (
        <CardHeader {...props}>
            {children}
        </CardHeader>
    );
}

export function AuthContainerTitle({ children, className, ...props }: AuthContainerTitleProps) {
    return (
        <CardTitle className={cn("text-3xl", className)} {...props}>
            {children}
        </CardTitle>
    );
}

export function AuthContainerDescription({ children, ...props }: AuthContainerDescriptionProps) {
    return (
        <CardDescription {...props}>
            {children}
        </CardDescription>
    );
}

export function AuthContainerContent({ children, ...props }: AuthContainerContentProps) {
    return (
        <CardContent {...props}>
            {children}
        </CardContent>
    );
}

export function AuthContainerForm({ children, className, ...props }: AuthContainerFormProps) {
    return (
        <form className={cn("flex flex-col gap-4",)} {...props}>
            {children}
        </form>
    )
}

export function AuthContainerFooter({ children, className, ...props }: AuthContainerFooterProps) {
    return (
        <CardFooter className={cn("border-t-neutral-300 dark:border-t-neutral-700", className)} {...props}>
            {children}
        </CardFooter>
    );
}
