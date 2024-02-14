import { CreateInitialStoryQueryParams } from "./types";
import { StoryOutputTypes } from "./utils/enums";

class Routes {
	static ViewStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}`;
	}
	static EditStory(type: StoryOutputTypes, genre: string, id: string) {
		return `/${this.StoryTypeToPath(type)}/${genre}/${id}/edit`;
	}
	static Landing() {
		return `/`;
	}
	static CreateStoryFromRoute(params: CreateInitialStoryQueryParams) {
		const stringified = Object.fromEntries(
			Object.entries(params).map(([key, value]) => [
				key,
				(value as string | number).toString(),
			])
		);
		const urlParams = new URLSearchParams(stringified);
		return `/create?${urlParams}`;
	}
	static Logout(returnTo = "/") {
		return `/api/auth/logout?returnTo=${returnTo}`;
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
}
export default Routes;
