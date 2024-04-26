import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { NextSeo } from "next-seo";
import Link from "next/link";

export const FAQs = () => {
	return (
		<>
			<NextSeo
				title="FAQs"
				description="Explore our updated FAQs to learn more about the transition from StoryBird.ai to Story.com and the new features available."
			/>

			<main className="max-w-4xl mx-auto p-4 text-lg">
				<h1 className="text-2xl font-semibold mb-6">
					Transitioning to Story.com - FAQs
				</h1>

				<Accordion type="single" collapsible defaultValue="whats-new">
					<AccordionItem value="whats-new">
						<AccordionTrigger>
							{`What's new? How is it different?`}
						</AccordionTrigger>
						<AccordionContent>
							{`We have been working diligently on transforming our website into
							something new and innovative, story.com to improve your story
							making capabilities with the help of narrative AI videos. This
							revamped platform is designed to bring AI story videos to life,
							offering a fresh experience unlike anything we've done before.
							Story.com will enhance your storytelling from an image book to AI
							video narrative. You can edit your stories prompts in each segment
							to customize your story or upload custom images to enhance the
							visuals in your narrative.`}
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="login">
						<AccordionTrigger>
							How do I login to Story.com as a StoryBird.ai user?
						</AccordionTrigger>
						<AccordionContent>
							Click the{" "}
							<Link
								href="https://story.com/auth/login"
								className={"underline text-blue-600"}
								target="_blank"
							>
								Sign Up
							</Link>{" "}
							button on story.com and use the same email from StoryBird.ai. By
							using the same credentials from StoryBird.ai you will be able to
							access all of your content including stories.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="platform">
						<AccordionTrigger>How does the platform work?</AccordionTrigger>
						<AccordionContent>
							On Story.com you can create stories and AI video narratives. After
							creating your account, go to the Generate tab on the left hand
							side. At the top, select if you would like to create a video or a
							storybook. In the text box, type in your text prompt that you
							would like to create a story or video about. Include details like
							the characters age and a description of them (their hair color,
							eye color, clothing color). This helps to create the story you are
							after. Ensure that you are selecting the correct language from the
							dropdown menu. Click the purple generate button to bring your
							story to fruition! It takes some time to load/finish creating. You
							can edit any stories or videos you have created by clicking the
							edit button to the right of the story or video. Navigate and save
							your edits on these pages by clicking on the purple button on the
							bottom right.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="subscription">
						<AccordionTrigger>
							What do I get with my subscription?
						</AccordionTrigger>
						<AccordionContent>
							Purchasing a subscription gives you more monthly credits. You can
							create more stories and videos and get more editing credits. All
							credits expire at the end of each month. Paid subscriptions do not
							provide any additional features or inclusions, simply more
							creating power!
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="products">
						<AccordionTrigger>What products do you offer?</AccordionTrigger>
						<AccordionContent>
							All of our plans offer the same products: Videos: you can download
							your videos for free Stories: you can purchase your stories as a
							PDF ($25) for personal use as EBook or printing format. You can
							purchase an Amazon publishing ($50) for Self-Publishing or ($100)
							for Fully Managed Publication. The Self-Publishing provides you
							with two formatted PDFs and the steps you need to create your own
							Amazon KDP account where you will upload your stories PDFs and
							publish your story yourself. The Fully Managed Publication
							provides you with peace of mind as our team takes care of your
							publishing for you. Purchasing an Amazon publication is for one
							book and payment is needed for each book you are wanting to
							publish. For both Amazon publications, you receive 100% of the
							royalties from the sales of your books after Amazon printing fees
							and royalties. These royalties come straight from Amazon to you.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="royalties">
						<AccordionTrigger>Where can I find my Royalties?</AccordionTrigger>
						<AccordionContent>
							Your royalties can be found on the{" "}
							<Link
								href="/account?step=payouts"
								className="underline text-blue-600"
								target="_blank"
							>
								Payouts
							</Link>{" "}
							tab of your Account. Your royalties from any sales generated will
							be visible the month following sales. Any sales from one month
							will be visible before the middle of the next month. (Example:
							Your book was published in June (but no books sold), and a few
							books sold in July. You will see your royalties in your account by
							the middle of August for the sales in July).
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</main>
		</>
	);
};

export default FAQs;
