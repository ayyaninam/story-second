import { useUser } from "@auth0/nextjs-auth0/client";
import { event } from "nextjs-google-analytics";
import { env } from "@/env.mjs";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";
import { SubscriptionConstants } from "@/constants/subscription-constants";

export type AnalyticsEvent =
	| "create_story"
	| "create_video"
	| "login_clicked"
	| "logout_clicked"
	| "login_page_viewed"
	| "login_page_login_clicked"
	| "login_page_signup_clicked"
	| "download_video_clicked"
	| "copy_video_clicked"
	| "test_onclick"
	| "create_new_clicked"
	| "story_clicked"
	| "generate_story"
	| "edit_image_modal_clicked"
	| "upgrade_subscription_clicked"
	| "pricing_frequency_changed"
	| "pricing_free_plan_clicked"
	| "upgrade_subscription_dialog_opened"
	| "upgrade_subscription_dialog_closed"
	| "create_subscription_initiated"
	| "add_card_initiated"
	| "add_card_successful"
	| "add_card_failed"
	| "create_subscription_successful"
	| "create_subscription_failed";
const useEventLogger = () => {
	const { user } = useUser();

	const { data } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
	});

	const registrationStatus = user ? "registered" : "unregistered";
	const userSubscription =
		SubscriptionConstants[data?.data?.subscription?.subscriptionPlan]?.name;
	const videoCreated = !!data?.data?.videoCount;

	return (action: AnalyticsEvent, variables?: { [key: string]: any }) => {
		if (action.length >= 40)
			console.error("Analytics event name too long: ", action);
		if (env.NEXT_PUBLIC_VERCEL_ENVIRONMENT !== "production")
			console.log({
				action,
				registrationStatus,
				subscriptionPlan: userSubscription,
				videoCreated,
				...variables,
			});
		if (typeof window === "undefined") return;
		return event(action, {
			registrationStatus: registrationStatus,
			subscriptionPlan: userSubscription,
			videoCreated: videoCreated,
			...variables,
		});
	};
};

export default useEventLogger;
