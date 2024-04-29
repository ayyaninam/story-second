export enum StoryImageStyles {
	Realistic = 0,
	Auto = 1,
	Cartoon = 2,
	Sketch = 3,
	WaterColor = 4,
	SciFi = 5,
	Anime = 6,
	Horror = 7,
}

export enum StoryLanguages {
	English,
	Spanish,
	French,
	German,
	Italian,
	Portuguese,
	Russian,
	Japanese,
	Chinese,
	Korean,
	Arabic,
	Hindi,
	Urdu,
	Persian,
	Turkish,
	Dutch,
	Polish,
	Swedish,
	Danish,
	Greek,
	Malay,
	Thai,
	Bulgarian,
	Croatian,
	Serbian,
	Ukrainian,
	Hebrew,
	Yiddish,
}

export enum StoryLengths {
	Short,
	Medium,
	Long,
}

export enum StoryInputTypes {
	Text,
	Audio,
	Video,
}
export enum StoryOutputTypes {
	Story,
	Video,
	SplitScreen,
}

export enum VoiceType {
	GenericMale,
	GenericFemale,
	Portuguese,
	Custom,
	None,
}

export enum AspectRatios {
	"512x512",
	"1024x1024",
	"1024x576",
	"576x1024",
	"1152x1024",
	"1024x1152",
}

export enum DisplayAspectRatios {
	"1024x576",
	"576x1024",
	"1024x1024",
}

export enum StepperStep {
	Script,
	Storyboard,
	Scenes,
	Preview,
}

export enum SegmentModifications {
	Edit,
	Add,
	Delete,
}
export enum SceneModifications {
	Edit,
	Add,
	Delete,
}
export enum SceneEdits {
	Edit,
	Add,
	Delete,
}
export enum SubscriptionPlan {
	Free,
	Basic,
	Pro,
	Premium,
	Custom,
}

export enum SubscriptionPeriod {
	Monthly,
	Annual,
}

export enum AllowanceType {
	StoryBooks,
	Videos,
	Credits,
}

export enum StoryboardViewType {
	Outline,
	Slides,
}

export enum ScriptEditorViewType {
	Title_Scenes,
	Just_Text,
}

export enum InputStatus {
	UNEDITED,
	EDITED,
	ADDED,
	DELETED,
}

export enum ScenesGenButtonType {
	all = "all",
	remaining = "remaining",
}

export enum PdfType {
	StoryBookPDF,
	EBookPDF,
}

export enum CreditSpendType {
	StoryGeneration, // Entire Story Generation
	StorySegmentEdit, // Edit a text segment
	AudioGeneration, // Generate audio for entire story
	AudioRegeneration, // Regenerate audio for a single segment
	ImageRegeneration, // Regenerate image for a single segment
	AmazonPublishing, // We publish to Amazon
	AmazonPublishingPDFOnly, // Give Amazon PDF Only
	WatermarkedEBookPDF, // Downloadable Watermarked PDF
	OriginalEBookPDF, // Downloadable Original PDF
	RegenerateSegmentWithAI, // Regenerate a segment with AI
	AddNewPage, // Add a new page to a story
	VideoLandscape, // Downloadable Video Story book Landscape
	VideoPortrait, // Downloadable Video Story book PDF Portrait
	VideoLandscapeSubtitle, // Downloadable Video Landscape with Subtitles,
	ImageScribble, // Scribble Image
	EnterContest, // Enter a contest
	WatermarkedStoryBookPDF, // Downloadable Watermarked Story Book PDF
	OriginalStoryBookPDF, // Downloadable Original Story Book PDF
}
