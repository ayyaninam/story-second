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
          <AccordionItem value="whats-new">
            <AccordionTrigger>What&apos;s new?</AccordionTrigger>
            <AccordionContent>
              We have been working diligently on transforming our website into something new and innovative, story.com, to improve your story making capabilities with the help of narrative AI videos. Have a look at some samples <Link href="/feed" className="underline" target="_blank">here</Link>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="difference">
            <AccordionTrigger>How is Story.com different from StoryBird.ai?</AccordionTrigger>
            <AccordionContent>
              We are transitioning StoryBird.ai to Story.com. This revamped platform is designed to bring AI story videos to life, offering a fresh experience unlike anything we&apos;ve done before. You will be able to edit your story in the same way to create video narrative.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="capabilities">
            <AccordionTrigger>What can Story.com do?</AccordionTrigger>
            <AccordionContent>
              Story.com will enhance your storytelling from an image book to AI video narrative. You can edit your story prompts in each segment to customize your story or upload custom images to enhance the visuals in your narrative.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data">
            <AccordionTrigger>What happens to my data?</AccordionTrigger>
            <AccordionContent>
              Nothing changes. You can log in to Story.com using the same credentials from StoryBird.ai. We will soon sunset StoryBird.ai, so you will need to download and save all of your content to your device. We still have your data and are working on integrating this.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="book-publishing">
            <AccordionTrigger>Can I still create books? Why am I not seeing the book publishing and story creation options?</AccordionTrigger>
            <AccordionContent>
              Yes. In time, all of the features available on StoryBird.ai will become available on Story.com. We are working on transitioning all of the same capabilities into our new platform. These will appear in the next few weeks.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transition">
            <AccordionTrigger>I don&apos;t want to transition. What are the next steps?</AccordionTrigger>
            <AccordionContent>
              If you are not interested in transitioning to our new platform Story.com on final launch, you can simply click delete my account and we&apos;ll delete all your data on our end. NOTE: This process is NOT reversible. If you delete your accounts, we would not be able to assist you with any queries regarding your stories or transactions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="royalties">
            <AccordionTrigger>I’ve purchased Fully Published Amazon services on StoryBird.ai, what happens to my royalties?</AccordionTrigger>
            <AccordionContent>
              For the time being, we’ll manually send you an email when you have royalties available. We will soon be adding a page to story.com that will grant you access to the same features as StoryBird.ai
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </>
  );
};

export default FAQs;
