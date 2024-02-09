/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
	"/status": {
		/** Status */
		get: operations["_status_status_get"];
	};
	"/authorized": {
		/** Authorized */
		post: operations["authorized_authorized_post"];
	};
	"/create-story": {
		/** Create Story */
		post: operations["create_story_create_story_post"];
	};
	"/regenerate-image": {
		/** Regenerate Image */
		post: operations["regenerate_image_regenerate_image_post"];
	};
}

export type webhooks = Record<string, never>;

export interface components {
	schemas: {
		/**
		 * CreateStoryRequest
		 * @description data = {
		 *     auth_id: str,
		 *     prompt: "This is the prompt",
		 *     video: boolean,
		 *     length?: StoryLengthEnum,
		 *     type?: VideoTypeEnum,
		 *     image_style: ImageStyleEnum,
		 * }
		 */
		CreateStoryRequest: {
			/** Prompt */
			prompt: string;
			length: components["schemas"]["StoryLengthEnum"];
			image_style: components["schemas"]["ImageStyleEnum"];
			language: components["schemas"]["StoryLanguageEnum"];
		};
		/** HTTPValidationError */
		HTTPValidationError: {
			/** Detail */
			detail?: components["schemas"]["ValidationError"][];
		};
		/**
		 * ImageStyleEnum
		 * @enum {integer}
		 */
		ImageStyleEnum: 0 | 2 | 3 | 4 | 5 | 6 | 7;
		/** RegenerateImageRequest */
		RegenerateImageRequest: {
			/** Story Id */
			story_id: string;
			/** Segment Idx */
			segment_idx: number;
			image_style: components["schemas"]["ImageStyleEnum"];
		};
		/**
		 * StoryLanguageEnum
		 * @enum {integer}
		 */
		StoryLanguageEnum:
			| 0
			| 1
			| 2
			| 3
			| 4
			| 5
			| 6
			| 7
			| 8
			| 9
			| 10
			| 11
			| 12
			| 13
			| 14
			| 15
			| 16
			| 17
			| 18
			| 19
			| 20
			| 21
			| 22
			| 23
			| 24
			| 25
			| 26
			| 27;
		/**
		 * StoryLengthEnum
		 * @enum {integer}
		 */
		StoryLengthEnum: 0 | 1 | 2;
		/** ValidationError */
		ValidationError: {
			/** Location */
			loc: (string | number)[];
			/** Message */
			msg: string;
			/** Error Type */
			type: string;
		};
	};
	responses: never;
	parameters: never;
	requestBodies: never;
	headers: never;
	pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {
	/** Status */
	_status_status_get: {
		responses: {
			/** @description Successful Response */
			200: {
				content: {
					"application/json": unknown;
				};
			};
		};
	};
	/** Authorized */
	authorized_authorized_post: {
		responses: {
			/** @description Successful Response */
			200: {
				content: {
					"application/json": unknown;
				};
			};
		};
	};
	/** Create Story */
	create_story_create_story_post: {
		requestBody: {
			content: {
				"application/json": components["schemas"]["CreateStoryRequest"];
			};
		};
		responses: {
			/** @description Successful Response */
			200: {
				content: {
					"application/json": unknown;
				};
			};
			/** @description Validation Error */
			422: {
				content: {
					"application/json": components["schemas"]["HTTPValidationError"];
				};
			};
		};
	};
	/** Regenerate Image */
	regenerate_image_regenerate_image_post: {
		requestBody: {
			content: {
				"application/json": components["schemas"]["RegenerateImageRequest"];
			};
		};
		responses: {
			/** @description Successful Response */
			200: {
				content: {
					"application/json": unknown;
				};
			};
			/** @description Validation Error */
			422: {
				content: {
					"application/json": components["schemas"]["HTTPValidationError"];
				};
			};
		};
	};
}
