import { event } from "nextjs-google-analytics";
import { env } from "@/env.mjs";
import { SubscriptionConstants } from "@/constants/subscription-constants";
import { useAuth } from "@/features/auth-prompt/providers/AuthContext";
import isBrowser from "./isBrowser";

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
	| "image_style_changed"
	| "edit_image_modal_clicked"
	| "edit_video_modal_clicked"
	| "regenerate_single_image"
	| "regenerate_single_image_popover"
	| "regenerate_scene_images"
	| "regenerate_all_images"
	| "regenerate_single_video"
	| "regenerate_all_videos"
	| "edit_segment_modal_clicked"
	| "upgrade_subscription_clicked"
	| "pricing_frequency_changed"
	| "pricing_free_plan_clicked"
	| "upgrade_subscription_dialog_opened"
	| "upgrade_subscription_dialog_closed"
	| "create_subscription_initiated"
	| "upgrade_subscription_initiated"
	| "add_card_initiated"
	| "add_card_successful"
	| "add_card_failed"
	| "create_subscription_successful"
	| "upgrade_subscription_successful"
	| "create_subscription_failed"
	| "upgrade_subscription_failed"
	| "video_watched_0"
	| "video_watched_25"
	| "video_watched_50"
	| "video_watched_75"
	| "video_watched_100";

const useEventLogger = () => {
	const { user, data } = useAuth();

	const registrationStatus = user ? "registered" : "unregistered";
	const userSubscription =
		SubscriptionConstants[data?.data?.subscription?.subscriptionPlan]?.name;
	const videoCreated = !!data?.data?.videoCount;

	return (action: AnalyticsEvent, variables?: { [key: string]: any }) => {
		if (action.length >= 40)
			return (
				isBrowser &&
				event(action, {
					registrationStatus: registrationStatus,
					subscriptionPlan: userSubscription,
					videoCreated: videoCreated,
					...variables,
				})
			);
	};
};

export default useEventLogger;
