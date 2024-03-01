import { Button } from "@/components/ui/button";
import Format from "@/utils/format";
import { Plus } from "lucide-react";
import React from "react";

import toast from "react-hot-toast";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {useUser} from "@auth0/nextjs-auth0/client";

export default function Navbar({ user }: { user: any }) {
  const { user: authUser } = useUser();
  return (
    <div className="flex justify-between bg-background rounded-tl-lg rounded-tr-lg border-b-[0.5px] border-border p-4">
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
      <div className="hidden md:block text-muted-foreground space-x-2 items-center">
        {/*<Button className="p-2" variant="ghost">*/}
        {/*	<PlayCircle className="mr-2 h-4 w-4 text-accent-700" /> Tutorial*/}
        {/*</Button>*/}
        <Button
          className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
          variant="default"
          onClick={() => {
            // TODO: Implement
            toast.success("Coming soon!")
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>
    </div>
  );
}
