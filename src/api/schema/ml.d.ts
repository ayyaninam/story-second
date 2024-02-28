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
  "/create": {
    /** Create Story */
    post: operations["create_story_create_post"];
  };
  "/create-serverless-segment": {
    /** Create Segment */
    post: operations["create_segment_create_serverless_segment_post"];
  };
  "/regenerate-image": {
    /** Regenerate Image */
    post: operations["regenerate_image_regenerate_image_post"];
  };
  "/regenerate-all-images": {
    /** Regenerate All Images */
    post: operations["regenerate_all_images_regenerate_all_images_post"];
  };
  "/regenerate-video": {
    /** Regenerate Video */
    post: operations["regenerate_video_regenerate_video_post"];
  };
  "/regenerate-all-videos": {
    /** Regenerate All Videos */
    post: operations["regenerate_all_videos_regenerate_all_videos_post"];
  };
  "/save-image": {
    /** Save Image */
    put: operations["save_image_save_image_put"];
  };
  "/edit-segments": {
    /** Edit Segment */
    put: operations["edit_segment_edit_segments_put"];
  };
  "/edit-scenes": {
    /** Edit Scene */
    put: operations["edit_scene_edit_scenes_put"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** CreateSegmentRequest */
    CreateSegmentRequest: {
      /** Story Id */
      story_id: string;
      /** Segment Idx */
      segment_idx: number;
      /** Segment */
      segment: string;
      image_style: components["schemas"]["ImageStyleEnum"];
      image_resolution: components["schemas"]["ImageResolutionEnum"];
      /** Test Interpolation */
      test_interpolation: boolean;
      story_type: components["schemas"]["OutputTypeEnum"];
    };
    /**
     * CreateStoryRequest
     * @description data = {
     *     input_type: InputTypeEnum, # 0: text, 1: audio, 2: video
     *     output_type?: OutputTypeEnum, # 0: story, 1: video, 2: splitscreen
     *     prompt: "This is the prompt", # The prompt for the story
     *     length?: StoryLengthEnum, # The length of the story
     *     image_style: ImageStyleEnum, # The style of the images
     *     language?: StoryLanguageEnum, # The language of the story
     *     video_key?: str, # The video key if the input is a video
     *     image_resolution?: ImageResolutionEnum, # The resolution of the images
     *     display_resolution?: DisplayResolutionEnum, # The resolution of the display
     * }
     */
    CreateStoryRequest: {
      /** @default 0 */
      input_type?: components["schemas"]["InputTypeEnum"];
      /** @default 1 */
      output_type?: components["schemas"]["OutputTypeEnum"];
      /**
       * Prompt
       * @default
       */
      prompt?: string;
      /**
       * Script Only
       * @default false
       */
      script_only?: boolean;
      /** @default 1 */
      length?: components["schemas"]["StoryLengthEnum"];
      /** @default 0 */
      image_style?: components["schemas"]["ImageStyleEnum"];
      /** @default 0 */
      language?: components["schemas"]["StoryLanguageEnum"];
      /** Video Key */
      video_key?: string;
      /** @default 2 */
      image_resolution?: components["schemas"]["ImageResolutionEnum"];
      /** @default 0 */
      display_resolution?: components["schemas"]["DisplayResolutionEnum"];
    };
    /**
     * DisplayResolutionEnum
     * @enum {integer}
     */
    DisplayResolutionEnum: 0 | 1;
    /** EditSceneOperation */
    EditSceneOperation: {
      operation: components["schemas"]["EditType"];
      /** Details */
      details: components["schemas"]["SceneEdit"] | components["schemas"]["SceneAdd"] | components["schemas"]["SceneDelete"] | null;
    };
    /** EditSceneRequest */
    EditSceneRequest: {
      /** Story Id */
      story_id: string;
      story_type: components["schemas"]["OutputTypeEnum"];
      /** Edits */
      edits: components["schemas"]["EditSceneOperation"][];
    };
    /** EditSegmentOperation */
    EditSegmentOperation: {
      operation: components["schemas"]["EditType"];
      /** Details */
      details: components["schemas"]["SegmentEdit"] | components["schemas"]["SegmentAdd"] | components["schemas"]["SegmentDelete"] | null;
    };
    /** EditSegmentRequest */
    EditSegmentRequest: {
      /** Story Id */
      story_id: string;
      story_type: components["schemas"]["OutputTypeEnum"];
      /** Edits */
      edits: components["schemas"]["EditSegmentOperation"][];
    };
    /**
     * EditType
     * @enum {integer}
     */
    EditType: 0 | 1 | 2;
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /**
     * ImageResolutionEnum
     * @enum {integer}
     */
    ImageResolutionEnum: 0 | 1 | 2 | 3 | 4 | 5;
    /**
     * ImageStyleEnum
     * @enum {integer}
     */
    ImageStyleEnum: 0 | 2 | 3 | 4 | 5 | 6 | 7;
    /**
     * InputTypeEnum
     * @enum {integer}
     */
    InputTypeEnum: 0 | 1 | 2;
    /**
     * OutputTypeEnum
     * @enum {integer}
     */
    OutputTypeEnum: 0 | 1 | 2;
    /** RegenerateAllImagesRequest */
    RegenerateAllImagesRequest: {
      /** Story Id */
      story_id: string;
      story_type: components["schemas"]["OutputTypeEnum"];
      image_style: components["schemas"]["ImageStyleEnum"];
      /** Scene Id */
      scene_id?: string;
    };
    /** RegenerateAllVideosRequest */
    RegenerateAllVideosRequest: {
      /** Story Id */
      story_id: string;
      story_type: components["schemas"]["OutputTypeEnum"];
      /** Scene Id */
      scene_id?: string;
    };
    /** RegenerateImageRequest */
    RegenerateImageRequest: {
      /** Story Id */
      story_id: string;
      /** Segment Idx */
      segment_idx: number;
      story_type: components["schemas"]["OutputTypeEnum"];
      /** Prompt */
      prompt: string;
      image_style: components["schemas"]["ImageStyleEnum"];
      /**
       * Batch Size
       * @default 1
       */
      batch_size?: number;
      /**
       * Cover Image
       * @default false
       */
      cover_image?: boolean;
      /**
       * Seed
       * @default 55428216
       */
      seed?: number;
      /**
       * Sampling Steps
       * @default 8
       */
      sampling_steps?: number;
      /**
       * Cfg Scale
       * @default 2
       */
      cfg_scale?: number;
    };
    /** RegenerateVideoRequest */
    RegenerateVideoRequest: {
      /** Story Id */
      story_id: string;
      /** Segment Idx */
      segment_idx: number;
      story_type: components["schemas"]["OutputTypeEnum"];
    };
    /** SaveImageRequest */
    SaveImageRequest: {
      /** Story Id */
      story_id: string;
      /** Segment Idx */
      segment_idx: number;
      story_type: components["schemas"]["OutputTypeEnum"];
      /** Image Key */
      image_key: string;
    };
    /** SceneAdd */
    SceneAdd: {
      /** Ind */
      Ind: number;
      /** Scenedescriptions */
      SceneDescriptions: string[];
    };
    /** SceneDelete */
    SceneDelete: {
      /** Ind */
      Ind: number;
    };
    /** SceneEdit */
    SceneEdit: {
      /** Ind */
      Ind: number;
      /** Scenedescription */
      SceneDescription: string;
    };
    /** SegmentAdd */
    SegmentAdd: {
      /** Ind */
      Ind: number;
      /** Segments */
      segments: components["schemas"]["SegmentData"][];
    };
    /** SegmentData */
    SegmentData: {
      /** Text */
      Text: string;
      /** Sceneid */
      SceneId: string;
    };
    /** SegmentDelete */
    SegmentDelete: {
      /** Ind */
      Ind: number;
    };
    /** SegmentEdit */
    SegmentEdit: {
      /** Ind */
      Ind: number;
      /** Text */
      Text: string;
    };
    /**
     * StoryLanguageEnum
     * @enum {integer}
     */
    StoryLanguageEnum: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27;
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
  create_story_create_post: {
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
  /** Create Segment */
  create_segment_create_serverless_segment_post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateSegmentRequest"];
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
  /** Regenerate All Images */
  regenerate_all_images_regenerate_all_images_post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegenerateAllImagesRequest"];
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
  /** Regenerate Video */
  regenerate_video_regenerate_video_post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegenerateVideoRequest"];
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
  /** Regenerate All Videos */
  regenerate_all_videos_regenerate_all_videos_post: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegenerateAllVideosRequest"];
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
  /** Save Image */
  save_image_save_image_put: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["SaveImageRequest"];
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
  /** Edit Segment */
  edit_segment_edit_segments_put: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["EditSegmentRequest"];
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
  /** Edit Scene */
  edit_scene_edit_scenes_put: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["EditSceneRequest"];
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
