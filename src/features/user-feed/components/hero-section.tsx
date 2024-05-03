import React, { CSSProperties } from "react";
import { mainSchema } from "@/api/schema";
import Format from "@/utils/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import DeleteAccountDialog from "@/features/account/components/delete-user-account";

const heroSectionContainer: CSSProperties = {
	borderRadius: "var(--radius-3xl, 24px)",
	border: "1px solid var(--border-base-alpha, rgba(10, 15, 41, 0.08))",
	background: "var(--background-surface-default, #FFF)",
	boxShadow: "0px 1px 2px 0px rgba(20, 21, 26, 0.05)",
};

function UserPageHeroSection({
	userData,
}: {
	userData: mainSchema["OtherUserInfoDTO"];
}) {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	return (
		<div className="w-full flex items-center justify-center gap-2 pb-6">
			<div
				className="flex w-full max-w-[1440px] overflow-hidden"
				style={heroSectionContainer}
			>
				<div
					className={`w-full flex flex-col lg:flex-row p-10 gap-8`}
					/*   bg-no-repeat bg-cover lg:bg-[url('/images/user-profile-page/banner.webp')]*/
				>
					<div className="flex flex-col items-center gap-4">
						<Avatar className="h-32 w-32 border-[1px] border-gray-200">
							<AvatarImage
								src={
									userData?.profilePicture
										? Format.GetImageUrl(userData.profilePicture)
										: ""
								}
							/>
							<AvatarFallback>
								{Format.AvatarName(
									userData?.name?.split(" ")[0] || "S",
									userData?.lastName || ""
								)}
							</AvatarFallback>
						</Avatar>
						<h2 className="text-xl font-semibold">{`${userData.name} ${userData.lastName}`}</h2>
						<p className="text-sm">
							<strong>{userData.videoCount}</strong> Videos,{" "}
							<strong>{userData.storyCount}</strong> Stories
						</p>
						{/*TODO: add some flag for canEdit and enable deletion*/}
						{/*<DeleteAccountDialog*/}
						{/*	dialogOpen={dialogOpen}*/}
						{/*	setDialogOpen={setDialogOpen}*/}
						{/*/>*/}
					</div>

					<div className="flex-1">
						<h2 className="text-xl font-semibold">
							{userData.name}&apos;s Story:
						</h2>
						<p className="text-base font-normal">{userData.bio}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserPageHeroSection;
