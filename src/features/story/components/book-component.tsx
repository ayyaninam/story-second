import cn from "@/utils/cn";
import React from "react";
import Book from "@/components/ui/story-book";
import { WebStory } from "@/components/ui/story-book/constants";
import {useMediaQuery} from "usehooks-ts";

const StoryBookComponent = ({
  story,
} : {
  story: WebStory | null;
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="h-[calc(100vh-60px)] flex flex-col justify-center items-center">
      <div>
        {story && <Book story={story} />}
      </div>
    </div>

  );
};

export default StoryBookComponent;
