import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, {CSSProperties} from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import {Plus} from "lucide-react";
import Routes from "@/routes";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Format from "@/utils/format";
import {useUser} from "@auth0/nextjs-auth0/client";
import {useMediaQuery} from "usehooks-ts";
import useEventLogger from "@/utils/analytics";

const mainHeaderContainer: {
  [key: string]: CSSProperties;
} = {
  light: {
    background:
      "radial-gradient(10.83% 5455.25% at 0% 50%, rgba(225, 234, 239, 0.5) 0%, rgba(225, 234, 239, 0) 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
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

export function AccountsHeader({ user }: { user: any }) {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const eventLogger = useEventLogger();

  const { user:authUser} = useUser();

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
        <div className="flex gap-x-2.5 items-center">
          <Avatar className="h-10 w-10 border-[1px] border-gray-200 text-accent-700">
            <AvatarImage src={Format.GetImageUrl(user?.profilePicture) || authUser?.picture || ""} />
            <AvatarFallback>
              {Format.AvatarName(user?.name || "S", user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="items-center">
            <div className="flex items-center gap-x-2">
              <p className="text-lg rounded-sm font-bold text-muted-foreground text-slate-800">
                {user?.name + " " + user?.lastName}
              </p>
            </div>
            <div className="flex items-center gap-x-2 text-slate-500 text-sm">
              @{user?.profileName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && (<Button
            className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
            variant="default"
            onClick={() => {
              eventLogger("create_new_clicked", {
                sourceUrl: router.asPath,
              })
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
