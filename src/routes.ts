import { CreateInitialStoryQueryParams } from "./types";
import { StoryOutputTypes } from "./utils/enums";

class Routes {
	public static defaultRedirect = "/";
	public static authpage = "/auth/login";
	static ViewStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}`;
	}
	static EditStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/edit`;
	}
	static Landing(errorMessage?: string) {
		let res = "/";
		if (errorMessage) {
			res += `?error=${encodeURIComponent(errorMessage)}`;
		}
		return res;
	}
	static Library() {
		return "/library";
	}
	static Explore() {
		return "/explore";
	}
	static CreateStoryFromRoute(params: CreateInitialStoryQueryParams) {
		// @ts-ignore
		const urlParams = this.CreateSearchParams(params);
		return `/create?${urlParams}`;
	}
	static ToAuthPage(returnTo = "/", params?: Record<string, any>) {
		let returnUrl = returnTo;

		if (params && Object.keys(params).length > 0) {
			const urlParams = this.CreateSearchParams(params);
			returnUrl += `?${urlParams}`;
		}
		return `${this.authpage}?returnTo=${encodeURIComponent(returnUrl)}`;
	}
	static Logout(returnTo = "/") {
		return `/auth/logout?returnTo=${returnTo}`;
	}
	static Login(returnTo = "/") {
		return `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
	}
	static Signup(returnTo = "/") {
		return `/api/auth/signup?returnTo=${encodeURIComponent(returnTo)}`;
	}
	private static StoryTypeToPath(type: StoryOutputTypes) {
		switch (type) {
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
		console.log(urlParams.toString());
		return urlParams;
	}
}
export default Routes;
