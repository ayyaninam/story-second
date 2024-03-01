import GeneratePage from "@/features/generate";
import React, { ReactElement } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { HydrationBoundary } from "@tanstack/react-query";
import PageLayout from "@/components/layouts/PageLayout";
import { NextSeo } from "next-seo";

function Generate() {
  return (
    <HydrationBoundary>
      <NextSeo
        title="Generate"
        description="Generate new Video, Trends and Storybooks"
        openGraph={{
          images: [
            {
              url: "/og-assets/og-story.png",
              width: 1200,
              height: 630,
              alt: "Generate with Story.com",
            },
          ],
        }}
      />
      {/* declare css variables */}
      <style jsx global>{`
        :root {
          --menu-item-border-color: rgba(206, 122, 255, 0.3);
          --menu-item-selected-background-color: radial-gradient(
            88.31% 100% at 0% 50%,
            rgba(187, 85, 247, 0.5) 25.5%,
            rgba(102, 129, 255, 0) 100%
          );
          --menu-item-selected-border-color: rgba(206, 122, 255, 0.2);
          --stepper-box-shadow: 0px 4px 4px 0px rgba(187, 85, 247, 0.4);
          --accent-color-50: #faf5ff;
          --accent-color-100: #f3e8ff;
          --accent-color-200: #e9d5ff;
          --accent-color-300: #d8b4fe;
          --accent-color-400: #c084fc;
          --accent-color-500: #a855f7;
          --accent-color-600: #9333ea;
          --accent-color-700: #7e22ce;
          --accent-color-800: #6b21a8;
          --accent-color-900: #581c87;
          --accent-color-950: #3b0764;
        }
      `}</style>
      <GeneratePage />
    </HydrationBoundary>
  );
}

Generate.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout pageIndex={1}>{page}</PageLayout>;
};

export default Generate;

export const getServerSideProps = withPageAuthRequired();
