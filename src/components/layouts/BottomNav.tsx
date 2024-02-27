import React, { CSSProperties } from 'react';
import { MenuIcon } from "lucide-react";
import ExploreIcon from "@/components/icons/side-nav/ExploreIcon";
import AiStar from "@/features/library/components/svgs/ai-star";
import LibraryIcon from "@/components/icons/side-nav/LibraryIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Format from "@/utils/format";
import RightPlay from "@/components/icons/right-play";
import {Skeleton} from "@/components/ui/skeleton";

// Assuming your CSS for the gradient background is correct
// React component CSS-in-JS styles
const bottomNavStyles: CSSProperties = {
  background: 'linear-gradient(180deg, rgba(2, 16, 23, 0.00) 0%, #021017 66.5%)',
  color: '#fff',
};

const BottomNav = ({ pageIndex }: { pageIndex: number }) => {
  const { user, isLoading } = useUser();
  return (
    <div
      className="lg:hidden bottom-0 p-2"
      style={bottomNavStyles}
    >
      <div className="flex items-center gap-2 md:gap-4 justify-around p-2">
        {/* TODO: figure out why we need menu icon?*/}
        {/*<MenuIcon color="#fff" height={34} width={34} />*/}
        <Link
          href="/explore"
        >
          <ExploreIcon size={34} />
        </Link>
        <AiStar size={34} /> {/* AiStar icon */}

        <Link
          href="/library"
        >
          <LibraryIcon size={34} /> {/* Library icon */}
        </Link>
        <>
          {/*// # TODO: enable profile pages when ready*/}
          {/*// # TODO: replace with userDetails from backend*/}
          {!isLoading ? (
            <Link
              href={"#"}
              // href={"/" + user?.nickname || ""}
            >
              <Avatar className="h-8 w-8 border-[1px] border-gray-200 text-accent-700">
                <AvatarImage src={user?.picture || ""} />
                <AvatarFallback>
                  {Format.AvatarName(user?.name?.split(" ")[0] || "S", user?.name?.split(" ")[1])}
                </AvatarFallback>
              </Avatar>
            </Link>
          ): <Skeleton className="h-8 w-8 rounded-full" />}
        </>
      </div>

    </div>
  );
};

export default BottomNav;
