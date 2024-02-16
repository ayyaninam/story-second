import { mergeAttributes, Node } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Component from "./Component";

export default Node.create({
	name: "reactComponent",

	group: "block",

	content: "inline*",

	parseHTML() {
		return [
			{
				tag: "react-component",
			},
		];
	},

	addKeyboardShortcuts() {
		return {
			"Mod-Enter": () => {
				return this.editor
					.chain()
					.insertContentAt(this.editor.state.selection.head, {
						type: this.type.name,
					})
					.focus()
					.run();
			},
		};
	},
	onUpdate() {
		const anchor = this.editor.state.selection.$anchor;
		const parent = anchor.parent;

		if (parent.content.size > 30) {
			// add a new node right after this
			const newNode = this.editor
				.chain()
				.insertContentAt(anchor.after(), {
					type: this.type.name,
				})
				.focus()
				.run();
		}
	},

	renderHTML({ HTMLAttributes }) {
		return ["react-component", mergeAttributes(HTMLAttributes), 0];
	},

	addNodeView() {
		return ReactNodeViewRenderer(Component);
	},
});
