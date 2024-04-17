import {ReactLogo} from "./ReactLogo";
import {KobbleLogo} from "./KobbleLogo";
import {SupabaseLogo} from "./SupabaseLogo.tsx";

export const PoweredBy = () => {
    return (
        <div>
            <div className="flex items-center justify-center gap-2">
                <ReactLogo />
                <span>+</span>
                <KobbleLogo />
                <span>+</span>
                <SupabaseLogo />
            </div>
        </div>
    );
}