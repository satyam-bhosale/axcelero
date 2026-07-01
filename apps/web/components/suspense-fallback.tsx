import { Loader2 } from "lucide-react";

export default function SuspenseFallback(){
    return (
        <div className="flex flex-row items-center gap-4">
            <Loader2 className="animate-spin"/>
            <p className="text-lg font-normal">Loading</p>
        </div>
    );
}