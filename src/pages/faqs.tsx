import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {NextSeo} from "next-seo";
import Link from "next/link";

export const FAQs = () => {
  return (
    <>
      <NextSeo
        title="FAQs"
        description="This page contains frequently asked questions about the transition from StoryBird.ai to Story.com."
      />

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-6">Transitioning to Story.com - FAQs</h1>

        <Accordion type="single" collapsible defaultValue="whats-new">
          <AccordionItem value="intro">
            <AccordionTrigger>What&apos;s new?</AccordionTrigger>
            <AccordionContent>
              We&apos;ve been hard at work transforming our platform to enhance your storytelling capabilities. Discover the new, innovative world of narrative AI videos at <Link href="https://story.com" className="underline" target="_blank">Story.com</Link>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="difference">
            <AccordionTrigger>How is Story.com different from StoryBird.ai?</AccordionTrigger>
            <AccordionContent>
              We are transitioning from StoryBird.ai to Story.com, offering AI story videos for a fresh and innovative experience. Edit your stories to create video narratives just like before, but with enhanced features.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="login">
            <AccordionTrigger>How do I login to Story.com as a StoryBird.ai user?</AccordionTrigger>
            <AccordionContent>
              Simply click the <Link href="https://story.com/auth/login" className="underline" target="_blank">Sign Up</Link> button on story.com and use the same email and password from StoryBird.ai to access all your content, including stories.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="capabilities">
            <AccordionTrigger>What can Story.com do?</AccordionTrigger>
            <AccordionContent>
              Story.com elevates your storytelling by transforming image books into AI video narratives. Customize your story prompts and upload custom images to enhance your narratives visually.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-loss">
            <AccordionTrigger>What data will I lose?</AccordionTrigger>
            <AccordionContent>
              Your edits on StoryBird.ai for books created BEFORE 1st March 2024 will not be carried over automatically. Don&apos;t worry - we still have the data. Please reach out to us if you&apos;re missing any data on story.com, and we will assist you to recover it.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-handling">
            <AccordionTrigger>What happens to my data?</AccordionTrigger>
            <AccordionContent>
              Your data remains unchanged, and you can download and save your content for backup. All storybooks created before March 1st, 2024, are available on Story.com. Any content added on StoryBird.ai after this date will transition to Story.com in the upcoming weeks.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="feature-availability">
            <AccordionTrigger>Why am I not seeing the book publishing and story creation options?</AccordionTrigger>
            <AccordionContent>
              Our team is heads down building the best experience for users like you! All the features available on StoryBird.ai, including book publishing and story creation, will eventually be available on Story.com as we complete the transition.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="opt-out">
            <AccordionTrigger>I don&apos;t want to transition. What are the next steps?</AccordionTrigger>
            <AccordionContent>
              If you prefer not to transition to our new platform, you can delete your account [we&apos;ll have the option on StoryBird for this]. Please note, this action is irreversible, and we will not be able to retrieve any data or assist with queries post-deletion.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="royalties">
            <AccordionTrigger>I’ve purchased Fully Published Amazon services on StoryBird.ai, what happens to my royalties?</AccordionTrigger>
            <AccordionContent>
              We will manually send you an email notification regarding your royalties for now. A new page will be added to Story.com soon to provide the same functionalities as StoryBird.ai.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </main>
    </>
  );
};

export default FAQs;
