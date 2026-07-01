import { Button } from "@shadcn/ui/components/button";
import { MailQuestionMark } from "lucide-react";

type Props = {
    label: string;
    action: () => void;
}

export default function EmailParamError({ label, action }: Props) {

    return (
        <div className="flex flex-col items-center px-5 gap-5">
            <div className="flex flex-col items-center opacity-50">
                <MailQuestionMark size={150} />
                <p className="text-center text-2xl font-medium">{"Email address is either missing or invalid"}</p>
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={action}
            >
                {label}
            </Button>
        </div>
    )
}