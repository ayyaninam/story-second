import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ReactComponent from "./extension";
const data = ["Hello, this is section one! ", "And this is section 2 :)."];

const Editor = () => {
	const editor = useEditor({
		extensions: [StarterKit, ReactComponent],
		// editorProps: {
		// 	handleTextInput: (view, from, to, text) => {
		// 		editor
		// 			?.chain()
		// 			.insertContentAt(from, `<react-component>${text}</react-component>`)
		// 			.focus()
		// 			.run();
		// 	},
		// },
		content: `<p>
    This is still the text editor you’re used to, but enriched with node views.
  </p>
  <react-component>
    <p>This is editable.</p>
  </react-component>
  <p>
    Did you see that? That’s a React component. We are really living in the future.
  </p>`,
		// onUpdate: ({ editor }) => {
		// 	editor
		// 		.getJSON()
		// 		.content?.filter((node) => node.type === "reactComponent")
		// 		.forEach((node) => {
		// 			// if the node text is greater than 50 characters, create a new node
		// 			console.log("node", node);
		// 			if (node.content?.length ?? 0 > 50) {
		// 				// truncate all nodes to 50 characters
		// 				node.content = node.content?.slice(0, 50);
		// 				// insert a new node after the current node
		// 				editor.commands.insertContent(`<react-component>
		//           <p></p>
		//         </react-component>`);
		// 				// set the cursor to be inside the new node
		// 				editor.commands.focus("end");
		// 			}
		// 		});
		// },
	});

	return (
		<div className="bg-gray-900 h-screen flex items-center justify-center text-slate-400">
			<div>
				<EditorContent
					editor={editor}
					className="px-4 py-2 border-2 border-slate-200 rounded-md border-solid"
				/>
			</div>
		</div>
	);
};

export default Editor;
