import { CreateInitialStoryQueryParams } from "./types";
import { StoryOutputTypes } from "./utils/enums";

class Routes {
	public static defaultRedirect = "/feed/all";
	public static authpage = "/auth/login";
	static ViewStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}`;
	}
	static EditStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/edit`;
	}
	static DownloadPdfStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/download-pdf`;
	}
	static PublishBook(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/publish-book`;
	}
	static Landing(errorMessage?: string) {
		let res = "/";
		if (errorMessage) {
			res += `?error=${encodeURIComponent(errorMessage)}`;
		}
		return res;
	}
	static Library() {
		return "/library/all";
	}
	static Feed() {
		return "/feed/all";
	}

	static Generate(message?: string) {
		return "/generate" + (message ? `?message=${message}` : "");
	}

	static CreateStoryFromRoute(params: CreateInitialStoryQueryParams) {
		// @ts-ignore
		const urlParams = this.CreateSearchParams(params);
		return `/create?${urlParams}`;
	}
	static ToAuthPage(returnTo = "/feed/all", params?: Record<string, any>) {
		let returnUrl = returnTo;

		if (params && Object.keys(params).length > 0) {
			const urlParams = this.CreateSearchParams(params);
			returnUrl += `?${urlParams}`;
		}
		return `${this.authpage}?returnTo=${encodeURIComponent(returnUrl)}`;
	}
	static ToSubscriptionPage(message = "") {
		return `/account?step=payment${message ? "&message=" + message : ""}`;
	}
	static Logout(returnTo = "/feed/all") {
		return `/auth/logout?returnTo=${returnTo}`;
	}
	static Login(returnTo = "/feed/all") {
		return `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
	}
	static Signup(returnTo = "/feed/all") {
		return `/api/auth/signup?returnTo=${encodeURIComponent(returnTo)}`;
	}
	static EditScript(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/edit/script`;
	}
	static EditStoryboard(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/edit/storyboard`;
	}
	static EditScenes(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/edit/scenes`;
	}
	private static StoryTypeToPath(type: StoryOutputTypes) {
		switch (Number(type)) {
			case StoryOutputTypes.SplitScreen:
				return "trends";
			case StoryOutputTypes.Video:
				return "video";
			case StoryOutputTypes.Story:
				return "story";
		}
	}
	private static CreateSearchParams(
		params: Record<string, string | number | boolean>
	) {
		const stringified = Object.fromEntries(
			Object.entries(params).map(([key, value]) => [key, value.toString()])
		);
		const urlParams = new URLSearchParams(stringified);
		return urlParams;
	}
}
export default Routes;
