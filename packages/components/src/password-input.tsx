import { Button } from "@shadcn/ui/components/button";
import { Input } from "@shadcn/ui/components/input";
import { Eye, EyeClosed } from "lucide-react";
import { useState, type ComponentProps } from "react";

export function PasswordInput({ ...props }: Omit<ComponentProps<"input">, "type" | "autoComplete">) {
    const [hidePassword, setHidePassword] = useState(true);
    return (
        <div className="flex flex-row items-center gap-1">
            <Input 
            type={hidePassword ? 'password' : 'text'}
            {...props} />
            <Button
                variant="ghost"
                type="button"
                onClick={() => setHidePassword(prev => !prev)}
            >
                {hidePassword ?  <Eye /> : <EyeClosed />}
            </Button>
        </div>
    )
}