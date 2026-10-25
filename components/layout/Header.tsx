import { Logo } from "@/components/brand/Logo";
import { LogoMotion } from "@/components/brand/LogoMotion";
import { flags } from "@/content/site.config";
import { HeaderBar } from "./HeaderBar";

/** Server wrapper: the logo SVG is rendered on the server and handed to the client header. */
export function Header() {
  return (
    <HeaderBar
      logo={
        <LogoMotion kind="header" className="block w-[116px] xl:w-[169px]">
          <Logo
            variant="stacked"
            figure={flags.logoFigure}
            uid="hdr"
            switchable
            intro
            className="h-auto w-full"
          />
        </LogoMotion>
      }
    />
  );
}
