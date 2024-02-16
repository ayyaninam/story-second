import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const data = ["Hello, this is section one! ", "And this is section 2 :)."];

const Tiptap = () => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: data.join(""),
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

export default Tiptap;
