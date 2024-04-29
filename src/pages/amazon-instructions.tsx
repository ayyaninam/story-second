import React from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";

export const AmazonInstructions = () => {
	return (
		<>
			<NextSeo
				title="FAQs"
				description="This page contains instructions on how to publish your book on Amazon through Story.com."
			/>

			<main className="max-w-4xl mx-auto p-4">
				<section className="mb-6">
					<h2 className="text-lg font-semibold mb-4">
						How to Publish Your Book on Amazon
					</h2>
					<p>
						Follow these steps to publish your book on Amazon through Story.com:
					</p>
					<ol className="list-decimal ml-8 mt-2">
						<li>
							Download your book’s cover PDF, your book manuscript PDF, and the
							publication details. Visit{" "}
							<Link
								href="/account?step=amazon-status"
								className="underline text-blue-600"
								target="_blank"
							>
								here
							</Link>{" "}
							for your publication details.
						</li>
						<li>
							If you don’t already have an Amazon KDP account, create one{" "}
							<Link
								href="https://kdp.amazon.com/signup"
								className="underline text-blue-600"
								target="_blank"
							>
								here
							</Link>
							. Complete the account setup, or log in if you already have an
							account.
						</li>
						<li>
							On KDP, click &quot;Create&quot;, then select
							&quot;Paperback&quot;. This will take you to a &quot;Paperback
							Details&quot; page.
						</li>
						<li>
							Copy the data from the Publication Details PDF to the Paperback
							Details page. If you’re writing a series of books, or it&apos;s
							your second addition, update the necessary fields.
						</li>
						<li>
							Save and Continue to &quot;Paperback Content&quot;. For the Print
							options, choose &quot;Premium color interior with white
							paper&quot;, trim size of &quot;6 x 9 in&quot; with &quot;No
							Bleed&quot; and &quot;Matte&quot; cover finish.
						</li>
						<li>
							Continue to upload your manuscript and cover file using the
							&quot;Upload a cover you already have&quot; option. You can
							download these from your purchase status page.
						</li>
						<li>
							If you see the option &quot;AI-Generated Content&quot;, select
							&quot;Yes&quot;. Texts: &quot;Entire work, with extensive
							editing&quot; using tools &quot;Story.com&quot;. For Images:
							&quot;Many AI-generated images, with extensive editing&quot; using
							&quot;Story.com&quot;. Launch a preview of your book to verify
							it’s correctly formatted.
						</li>
						<li>
							Go to the &quot;Paperback Rights & Pricing&quot; page and list
							your book prices. We suggest a price range of $10-$30 USD. As a
							final step in the process, hit &quot;Publish Your Paperback
							Book&quot; to confirm your submission and send it to Amazon for
							review.
						</li>
					</ol>
					<p>
						The process should take about 15 minutes. Amazon will then review
						the book and usually publish it within 48 hours. They will send you
						a publication link directly.
					</p>
					<p>
						If you have any questions, please contact us using the chat in the
						bottom right.
					</p>
				</section>
			</main>
		</>
	);
};

export default AmazonInstructions;
