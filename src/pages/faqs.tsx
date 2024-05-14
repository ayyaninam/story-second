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

			<main className="max-w-4xl mx-auto p-4 text-xl">
				{" "}
				{/* Increased from text-lg */}
				<h1 className="text-3xl font-semibold mb-6">
					{" "}
					{/* Increased from text-2xl */}
					Transitioning to Story.com - FAQs
				</h1>
				<Accordion type="single" collapsible defaultValue="whats-new">
					<AccordionItem value="whats-new">
						<AccordionTrigger>
							{`What's new? How is it different?`}
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								{`We have been working diligently on transforming our website into
							something new and innovative, story.com to improve your story
							making capabilities with the help of narrative AI videos. This
							revamped platform is designed to bring AI story videos to life,
							offering a fresh experience unlike anything we've done before.
							Story.com will enhance your storytelling from an image book to AI
							video narrative. You can edit your stories prompts in each segment
							to customize your story or upload custom images to enhance the
							visuals in your narrative.`}
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="login">
						<AccordionTrigger>
							How do I login to Story.com as a StoryBird.ai user?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								Click the{" "}
								<Link
									href="https://story.com/auth/login"
									className={"underline text-blue-600"}
									target="_blank"
								>
									Sign Up
								</Link>{" "}
								button on story.com and use the same email from StoryBird.ai. To
								access your StoryBird content, you would need to sign up using
								the same email and authentication method on Story.com first. On
								sign up, you will see all of your data from StoryBird into your
								Story.com account. Note that it is necessary to Sign Up the
								first time using the same email address and Authentication
								method (If you used google sign in, use google sign in. If you
								used ID-Password, create a new password on Story.com)
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="platform">
						<AccordionTrigger>How does the platform work?</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								On Story.com you can create stories and AI video narratives.
								<ul className="list-disc pl-8">
									<li>
										<b>Create a Story or Video:</b> start by going to the
										Generate tab on the left hand side. At the top, select if
										you would like to create a video or a storybook. In the text
										box, type in your text prompt that you would like to create
										a story or video about. Include details like the characters
										age and a description of them (their hair color, eye color,
										clothing color). This helps to create the story you are
										after. Ensure that you are selecting the correct language
										from the dropdown menu. Click the purple generate button to
										bring your story to fruition! It takes some time to
										load/finish creating.
									</li>
									<li>
										<b>Edit a Story or Video:</b> Click on the edit button
										beside or under your story or video. On the Storyboard tab
										you can edit the images and text. Each text line is a new
										page/scene. You can click on the image to regenerate and
										select a new image for the scene/page. Once finished, click
										on the Regenerate Audio button on the bottom left to save
										the audio changes and then click on the Generate Video
										Scenes button on the bottom right to save and move on to the
										next tab. On the Scenes tab click on Regenerate video for
										the edited sentences in the previous tabs. Note that - Any
										change in text or image will reset the subsequent image and
										video. And after any change in text, Audio has to be
										regenerated to load the video. Once everything is generated,
										click Preview Your Video on the bottom right to preview. If
										you are happy with the result, click Share & Export Video on
										the bottom right to save all changes.
									</li>
									<li>
										<b>Purchase my story in PDF or for Publishing to Amazon:</b>{" "}
										select the story in your library. Click on the story you
										would like to purchase or publish. Once you have clicked on
										the story, you will then see the buttons either beside or
										underneath your story. Click on the Download PDF button or
										Publish on Amazon button depending on your preference.
										Follow the steps from here.
									</li>
									<li>
										<b>Find my stories/Videos:</b> they are located in My
										Library
									</li>
									<li>
										<b>Find my Account Information:</b> You can find this under
										the Account tab on the left hand side.{" "}
									</li>
								</ul>
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="subscription">
						<AccordionTrigger>
							What do I get with my subscription?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								You can view subscription details by clicking on Upgrade
								Subscription on the bottom left hand side of the Account Page.
								Purchasing a subscription gives you more monthly credits
								allowing you to create more stories and videos and get more
								story and video editing credits. All credits expire at the end
								of each month. Paid subscriptions come with free video
								downloads.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="products">
						<AccordionTrigger>What products do you offer?</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								<b>Videos:</b> Subscribed members can download any video for
								free
								<br />
								<br />
								<b>Stories:</b> you can purchase your stories as a PDF ($25) for
								personal use as EBook or printing format.
								<br />
								<br />
								You can purchase an Amazon publishing: ($50) for Self-Publishing
								or ($100) for Fully Managed Publication. The payment is a one
								time payment for the one publishing. Both options are for a
								paperback book and you receive 100% of the royalties from the
								sales of your books after Amazon printing fees and royalties.
								These royalties come straight from Amazon to you. The
								Self-Publishing provides you with two formatted PDFs and the
								steps you need to create your own Amazon KDP account where you
								will upload your stories PDFs and publish your story yourself.
								The Fully Managed Publication provides you with peace of mind as
								our team takes care of your publishing for you.
								<br />
								<br />
								Note that PDF purchases and Amazon purchases are one time only.
								You would need to make another payment for another video/book.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="royalties">
						<AccordionTrigger>Where can I find my Royalties?</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								Your royalties can be found on the{" "}
								<Link
									href="/account?step=payouts"
									className="underline text-blue-600"
									target="_blank"
								>
									Payouts
								</Link>{" "}
								tab of your Account. Your royalties from any sales generated
								will be visible the month following sales. Any sales from one
								month will be visible before the middle of the next month.
								(Example: Your book was published in June (but no books sold),
								and a few books sold in July. You will see your royalties in
								your account by the middle of August for the sales in July).
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="loading-issues">
						<AccordionTrigger>
							Why are my videos and stories not loading?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								This is most likely due to incomplete Editing. Please make sure
								that all of your images, videos and audios have been queued for
								generating. If the video or story doesn’t load even after
								queuing, please contact us.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="data-transfer">
						<AccordionTrigger>
							I came here from Storybird. Where’s my data?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								Click Sign Up using the same credentials from StoryBird.ai.
								Story.com has all of your story books. Changes (edits) made to
								stories created on StoryBird.ai after March 5th were not saved.
								We will not be transferring the edits of the newer stories.
								Please contact us if you want us to update / restore stories.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="policies">
						<AccordionTrigger>
							Where can I find the privacy policies?
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-lg">
								You can find our privacy policies at{" "}
								<Link
									href="https://www.story.com/privacy-policy"
									className="underline text-blue-600"
									target="_blank"
								>
									this link
								</Link>
								.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</main>
		</>
	);
};

export default FAQs;
