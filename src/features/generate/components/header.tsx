import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, {CSSProperties} from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import {Plus} from "lucide-react";
import Routes from "@/routes";
import {useMediaQuery} from "usehooks-ts";

const mainHeaderContainer: {
  [key: string]: CSSProperties;
} = {
  light: {
    background:
      "radial-gradient(10.83% 5455.25% at 0% 50%, rgba(240, 214, 255, 0.5) 0%, rgba(240, 214, 255, 0) 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  },
  // TODO: Dark variant
  dark: {
    background:
      "radial-gradient(10.83% 5455.25% at 0% 50%, rgba(40, 90, 85, 0.5) 0%, rgba(40, 90, 85, 0) 100%), linear-gradient(0deg, #2E2E2E, #2E2E2E)",
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  },
};

const subHeaderContainer: CSSProperties = {
  borderTop: "0.5px solid var(--Colors-Slate-400, #94ABB8)",
  background: "var(--base-white, #FFF)",
};

export const GenerateHeader = ({
                              }: {
}) => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
      }}
      className="flex flex-col items-start pb-[1px] z-50 bg-background"
    >
      <div
        className="flex justify-between items-center px-[20px] py-[14px] w-full"
        style={theme ? mainHeaderContainer[theme] : mainHeaderContainer.light}
      >
        <div className="flex items-start w-[250px]">
          <Image
            src="/images/nav-icons/generate-icon.png"
            alt="Generate"
            width={40}
            height={40}
          />
          <div className="pl-[12px] flex flex-col items-start">
            <span className="text-slate-950 text-base font-bold">Generate</span>
            <span className="text-accent-700 text-sm font-normal">Create a New Experience</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && (<Button
            className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
            variant="default"
            onClick={() => {
              router.push(Routes.Generate());
            }}
          >
            <Plus className="h-4 w-4" /> Create New
          </Button>)}
        </div>
      </div>
      <div
        className="px-8 w-full flex justify-between items-center relative transition-all ease-in-out duration-300"
        style={subHeaderContainer}
      >
      </div>
    </div>
  );
};
