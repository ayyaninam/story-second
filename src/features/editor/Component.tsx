import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";

const Component = (props: any) => {
	return (
		<NodeViewWrapper className="hover:bg-purple-200 focus:text-purple-400">
			<NodeViewContent as={"span"} className="content" />
		</NodeViewWrapper>
	);
};
export default Component;
