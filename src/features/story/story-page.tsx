import {useRouter} from "next/router";
import {useMediaQuery} from "usehooks-ts";
import {useEffect, useState} from "react";
import {WebStory} from "@/components/ui/story-book/constants";
import api from "@/api";
import StoryBookComponent from "@/features/story/components/book-component";
import Navbar from "@/features/story/components/Navbar";

const StoryBookPage = ({storyData} : {storyData: WebStory | null}) => {
  const router = useRouter();
  const { genre, id } = router.query;
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const [story, setStory] = useState<WebStory | null>(storyData || null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!genre || !id) {
        return;
      }

      const story = await api.storybook.getStory({
        topLevelCategory: genre as string,
        slug: id as string,
      });

      if (story) {
        setStory(story);
      }
    };

    void fetchStory();
  }, [genre, id]);

  return (
    <div className={`bg-reverse items-center overflow-y-scroll md:overflow-hidden`}>
      <Navbar WebstoryData={story} />
      <StoryBookComponent story={story}  />
    </div>
  )
}

export default StoryBookPage;
