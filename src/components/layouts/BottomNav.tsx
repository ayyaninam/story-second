import React, { CSSProperties } from 'react';
import { MenuIcon } from "lucide-react";
import ExploreIcon from "@/components/icons/side-nav/ExploreIcon";
import AiStar from "@/features/library/components/svgs/ai-star";
import LibraryIcon from "@/components/icons/side-nav/LibraryIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

// Assuming your CSS for the gradient background is correct
// React component CSS-in-JS styles
const bottomNavStyles: CSSProperties = {
  background: 'linear-gradient(180deg, rgba(2, 16, 23, 0.00) 0%, #021017 66.5%)',
  color: '#fff',
};

const BottomNav = ({ pageIndex }: { pageIndex: number }) => {
  const { user } = useUser();
  return (
    <div
      className="lg:hidden bottom-0 p-2"
      style={bottomNavStyles}
    >
      <div className="flex items-center gap-2 md:gap-4 justify-around p-2">
        <MenuIcon color="#fff" height={34} width={34} />
        <ExploreIcon size={34} /> {/* Explore icon */}
        <AiStar size={34} /> {/* AiStar icon */}
        <LibraryIcon size={34} /> {/* Library icon */}
        <Link href={``}>
          <Avatar className="h-10 w-10 border-[1px] border-gray-200">
            <AvatarImage src={user?.picture || ""} />
            <AvatarFallback>
              CN
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

    </div>
  );
};

export default BottomNav;
