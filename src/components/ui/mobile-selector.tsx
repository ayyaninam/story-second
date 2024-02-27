import { VIDEO_ORIENTATIONS } from "@/features/explore/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MobileSelector = ({
  selectedTab,
  setSelectedTab,
  tabs,
                                        }: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  tabs: any[];
}) => {
  return (
    <Select onValueChange={setSelectedTab} defaultValue={selectedTab} >
      <SelectTrigger
        className="h-7 py-0.5 bg-background px-4 justify-center rounded-[10000px]
        text-sm font-normal ease-linear duration-300 transition-all flex items-center border border-solid gap-1
        border-border hover:text-accent-700
        text-accent-600 focus:ring-0 focus:ring-offset-0"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white text-[#000000] border-muted"
         ref={(ref) => {
           {/*Necessary to prevent default*/}
           if (!ref) {
             return
           }

           ref.ontouchstart = (e) => {
             e.preventDefault()
           }
         }}>
        {tabs.map((tab) => (
          <SelectItem
            value={tab.id}
            key={tab.id}
            highlightSelection={true}
          >
            <div className="flex items-center gap-2">
              <span>{tab.icon}</span>
              {tab.value}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
