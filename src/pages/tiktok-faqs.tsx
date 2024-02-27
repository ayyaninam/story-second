import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {NextSeo} from "next-seo";
import Link from "next/link";

export const TikTokFAQs = () => {
  return (
    <>
      <NextSeo
        title="TikTok FAQs"
        description="TikTokFAQs page contains frequently asked questions about the Story.com TikTok."
      />

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-6">Story.com TikTok - FAQs</h1>

        <Accordion type="single" collapsible defaultValue="whats-new">
          <AccordionItem value="whats-new">
            <AccordionTrigger>How do I create a post?</AccordionTrigger>
            <AccordionContent>
              Go to <Link href={'https://www.story.com/tiktok'} className="underline text-blue">https://www.story.com/tiktok</Link>, click on Upload a TikTok draft here. You can select either the record button or upload your TikTok directly. From here, choose your style under the drop down and click Produce it.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="edit">
            <AccordionTrigger>Will I be able to edit my videos?</AccordionTrigger>
            <AccordionContent>
              Yes, we are working hard on our platform to allow you to edit your videos. Currently, you can edit your videos by clicking on the edit button on the preview page. Note: This feature is work in progress and you may not be able to edit all the features at the moment.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="capabilities">
            <AccordionTrigger>What does uploading my video do?</AccordionTrigger>
            <AccordionContent>
              Story.com will use the narrative in your video to generate a split screen story to augment viewers engagement and enhance your videos narrative.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </>
  );
};

export default TikTokFAQs;