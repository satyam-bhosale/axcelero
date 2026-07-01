import AxceleroLogo from "@client/features/auth/components/axcelero-logo";
import Image from "next/image";
import { type ReactNode } from "react";

type Props = {
    children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
    return <main className="w-screen h-screen font-sans overflow-hidden">
        <div className="w-full h-full rounded-lg flex flex-row gap-2">
            <div className="flex-1 hidden lg:block overflow-hidden">
                <Image
                    src="/images/auth-image.jpg"
                    alt="abstract-purple-color-art"
                    className="w-full h-full object-cover"
                    width="1280"
                    height="1920"
                    loading="eager"
                />
            </div>
            <div className="flex-1 flex flex-col lg:bg-none bg-cover bg-center">
                <div className="flex flex-row items-center justify-between">
                    <AxceleroLogo/>
                </div>
                <div className="w-full h-full flex justify-center items-center z-10">
                    {children}
                </div>
            </div>
        </div>
    </main>
}