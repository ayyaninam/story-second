import { createContext } from "react";

export type PromptContextType = {
    input: string,
    openStoryBooksDialog: boolean,
    openSubscriptionDialog: boolean,
    openCreditsDialog: boolean,
    openVerificationDialog: boolean,
    isLoading: boolean,
    selectedVideoRatio: string,
    selectedVideoLength: 0 | 1 | 2 | undefined,
    selectedLanguage: string,
    videoFileId: string | null,
    value: string,

    setInput: (input: string) => void,
    setOpenStoryBooksDialog: (input: boolean) => void,
    setOpenSubscriptionDialog: (input: boolean) => void,
    setOpenVerificationDialog: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenCreditsDialog: (input: boolean) => void,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedVideoRatio: (input: string) => void,
    setSelectedVideoLength: (input: 0 | 1 | 2 | undefined) => void,
    setSelectedLanguage: (input: string) => void,
    setVideoFileId: (input: string | null) => void,
    setValue: (input: string) => void,
}


const PromptContext = createContext<PromptContextType>(
    {
        input: "",
        openStoryBooksDialog: false,
        openSubscriptionDialog: false,
        openCreditsDialog: false,
        isLoading: false,
        selectedVideoRatio: "",
        selectedVideoLength: undefined,
        selectedLanguage: "",
        videoFileId: null,
        openVerificationDialog:false,
        value: "",
        setInput: () => { },
        setOpenStoryBooksDialog: () => { },
        setOpenSubscriptionDialog: () => { },
        setOpenCreditsDialog: () => { },
        setIsLoading: () => { },
        setSelectedVideoRatio: () => { },
        setSelectedVideoLength: () => { },
        setSelectedLanguage: () => { },
        setVideoFileId: () => { },
        setValue: () => { },
        setOpenVerificationDialog: () => { },


    }
)


export default PromptContext;