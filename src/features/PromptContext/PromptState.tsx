'use client'

import { useContext, useState } from "react"
import PromptContext from "./PromptContext";

import {
    languages,
    tabs,
    TabType,
    videoRatios,
} from "@/features/generate/constants";

import { PromptContextType } from "./PromptContext";
import { StoryLengths } from "@/utils/enums";

export const PromptProvider: any = ({ children }: { children: any }) => {

    const [input, setInput] = useState("");
    const [openStoryBooksDialog, setOpenStoryBooksDialog] = useState(false);
    const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
    const [openVerificationDialog, setOpenVerificationDialog] = useState(false);
    const [openCreditsDialog, setOpenCreditsDialog] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedVideoRatio, setSelectedVideoRatio] = useState(
        videoRatios[0]?.value.toString() || ""
    );
    const [selectedVideoLength, setSelectedVideoLength] = useState<PromptContextType["selectedVideoLength"]>(
        StoryLengths.Short
    );

    const [selectedLanguage, setSelectedLanguage] = useState(
        languages[0]?.value || "English"
    );
    const [videoFileId, setVideoFileId] = useState<string | null>(null);

    const [value, setValue] = useState("")

    return (
        <PromptContext.Provider
            value={{
                input,
                openStoryBooksDialog,
                openSubscriptionDialog,
                openCreditsDialog,
                isLoading,
                selectedVideoRatio,
                selectedVideoLength,
                selectedLanguage,
                videoFileId,
                value,
                openVerificationDialog,
                setInput,
                setOpenStoryBooksDialog,
                setOpenSubscriptionDialog,
                setOpenCreditsDialog,
                setIsLoading,
                setSelectedVideoRatio,
                setSelectedVideoLength,
                setSelectedLanguage,
                setVideoFileId,
                setValue,
                setOpenVerificationDialog,
            }}>
            {children}

        </PromptContext.Provider>
    )
}


export const usePrompt = () => useContext(PromptContext)