export default function PrivacyPolicy() {
	return (
		<div className="flex flex-col w-full m-4">
			<h1 className="font-aleo text-3xl sm:text-4xl font-semibold pb-3 border-b-[5px] border-brand-fill">
				Privacy Policy
			</h1>
			<p className="mt-8">
				This Privacy Policy describes how Authorly (together with its affiliates
				companies - “Authorly,” “we,” “our,” or “us”) collect(s), store(s),
				use(s) and disclose(s) personal data regarding individuals (“you”) who:
			</p>
			<ol className="mt-4 px-6" style={{ listStyleType: "lower-roman" }}>
				<li>
					visit(s) or otherwise interact(s) with our website(s) (“Visitors”),
					available at www.Authorly.ai or any other website, webpage, e-mail,
					text message or online ad under our control (collectively -
					“Website(s))”);
				</li>
				<li>
					Users accessing and using Services, including, but not limited to,
					Authorly and Authorly Dashboard, via the Website, or the Authorly
					desktop or App, addons or extensions upon authorization from Customer.
				</li>
			</ol>
			<p className="mt-4">
				Specifically, this Privacy Policy describes our practices regarding:
			</p>
			<nav>
				<ol className="list-decimal mt-4 px-6">
					{privacyData.sections.map((item, i) => (
						<li key={item.title}>
							<h2>{item.title}</h2>
						</li>
					))}
				</ol>
			</nav>

			{privacyData.sections.map((section, i) => (
				<div
					key={"section" + i + 1}
					id={"section-" + i + 1}
					className="relative mt-4"
				>
					<h2 className="text-xl font-semibold font-aleo sm:text-2xl">
						{i + 1}. {section.title}
					</h2>
					{section.subsections.map((subsection, i) => (
						<div key={subsection.title + i + 1}>
							<p className="mt-2">
								{subsection.title ? (
									<span className="font-semibold">
										{subsection.title}:&nbsp;
									</span>
								) : null}
								{subsection.text}
							</p>
							{subsection.list ? (
								<ul className="list-disc mt-4 px-6">
									{subsection.list.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							) : null}
						</div>
					))}
				</div>
			))}
		</div>
	);
}

const privacyData = {
	sections: [
		{
			title: "Data Collection",
			subsections: [
				{
					title: "",
					text: "We may collect technical data, profile data, customer data, content, and other data received from you, your organization, or other third party sources, in accordance with this Privacy Policy.",
				},
				{
					title: "",
					text: "We collect various types of personal data regarding our Users as well as data regarding Visitors to our Website(s). Such data is typically collected and generated through your interaction with us, use of our Wesbite(s), or our Service, through automatic means, or directly from you, from other Users, from our Customers, or from other third parties (including Service Providers, as defined below).",
				},
				{
					title: "",
					text: "Specifically, we collect the following categories of data (which, to the extent it relates to an identified or identifiable individual, is deemed as “Personal Data“ or “Personal Information”):",
				},
				{
					title: "Data Automatically Collected or Generated",
					text: "When you visit, interact with, or use our Service, we may collect, record or generate certain technical data about you. We do so either independently or with the help of third party Service Providers (as defined in Section 4 below), including through the use of “cookies” and other tracking technologies (as detailed in Section 5 below).",
				},
				{
					title: "",
					text: "Such data consists of connectivity, technical and aggregated usage data, such as IP addresses and general locations, device data (like type, operating system, mobile device id, browser version, locale and language settings used), date and time stamps of usage, the cookies and pixels installed or utilized on such device and the recorded activity (sessions, clicks and other interactions) of Visitors and Users in connection with our Service and when you use our Website(s). In addition, phone calls (e.g. with our customer success or product consultants) may be automatically recorded, tracked and analyzed, for purposes including analytics, service, operations, click-tracking, monitoring of website use by anyone who visits or uses the website, biometrics, and business quality control and improvements, and record-keeping purposes.",
				},
				{
					title: "User Data Received From You",
					text: "When you contact us or sign up to the Service and create your individual profile (“User Profile”), you may provide us with Personal Data. This includes your name, workplace and position, contact details (such as e-mail, phone and address), account login details (e-mail address and passwords which are automatically hashed), as well as any other data you choose to provide when you use our Service, contact us, or interact with others via our Service. For example, you may connect your Google account (Facebook, LinkedIn, or other social media accounts) when you sign up or login to the Service, and thereby provide us with your name, e-mail address, image and other details listed on your profile there. You may also provide us with your profile photo, location, time-zone, skills, device, general location, and activity logs and data; as well as your preferences, characteristics and objectives for using the Service (collectively, “User Data.”)",
				},
				{
					title: "",
					text: "You may also send us a “Contact Us” or support requests, or provide us with feedback, including by submitting an online form on our Service or social media channels, by posting on any of our online public forums or communities, by sending an e-mail to any of our designated addresses, or any other form of communication. Such data may include details on a problem you are experiencing, contact information and any other documentation, screen recording, screenshots or other information.",
				},
				{
					title: "",
					text: "Our Customers may provide us with additional User Data such as their billing details, business needs and preferences. To the extent that such data concerns a non-human entity (e.g. the bank account of a company or business, credit card, or third-party payment platform), we will not regard it as “Personal Data” and this Privacy Policy will not apply to it, although it will remain confidential data.",
				},
				{
					title: "Customer Data Containing Personal Data",
					text: "Users may choose to upload or submit to our Service certain content, materials and data on behalf of their Account or the Account owner (our Customer), which includes Personal Data  (collectively “Customer Data”). For the purpose of this Privacy Policy, User Terms of Service, and other related agreements, Account owner is the Customer who has entered into a commercial agreement with Authorly. Personal Data which is included in Customer Data will only be processed by Authorly on behalf of our Customer (who owns the Customer’s Account), in accordance with our Data Processing Addendum (to the extent applicable), other agreements with such Customer, and this Privacy Policy.",
				},
				{
					title: "Data Concerning Service Integrations",
					text: "If, when using the Service, you choose to integrate the Customer’s Account on a third-party service (and such service is supported by our Service), we will connect and integrate that third-party service to ours. The third-party provider of this integration may receive certain relevant data about or from your Customer’s Account (including User Data), or share certain relevant data from your Customer’s Account on their service with our Service, depending on the nature and purpose of such integration. Note that we do not receive or store your passwords for any of these third-party services (but do typically require your API key in order to integrate with them). If you do not wish your data to be shared with such third-party service(s), please contact your Admin.",
				},
				{
					title: "Data obtained through Analytics Tools",
					text: "We use analytics tools (e.g. Google Analytics) to collect data about the use of our Website(s) and Service. Analytics tools collect data such as how often Users and Visitors visit or use the Website(s) or Service, which pages they visit and when, and which website, ad or e-mail message brought them there.",
				},
			],
		},
		{
			title: "Data Uses",
			subsections: [
				{
					title: "",
					text: "We use Personal Data to provide, improve, and secure our Service; for analytics, marketing and sales purposes; to comply with applicable laws; and to support other legitimate business interests.",
				},
				{
					title: "",
					text: "We use Personal Data as necessary for the performance of our Service; to comply with our legal and contractual obligations; and to support our legitimate business interests in maintaining and improving our Service, e.g. in understanding how our Service are used and how our campaigns are performing, and gaining insights which help us dedicate our resources and efforts more efficiently; in marketing, advertising and selling our Service to you and others; providing customer service and technical support; and protecting and securing our Users, Customers, Visitors, ourselves and our Service.",
				},
				{
					title: "",
					text: 'If you reside or are using the Service (i) in a territory governed by privacy laws which determine that "consent" is the only or most appropriate legal basis for processing Personal Data (in general, or specifically with respect to the types of Personal Data you choose to share via the Service), your acceptance of our Terms and of this Privacy Policy will be deemed as your consent to the processing of your Personal Data for all purposes detailed in this Privacy Policy. If you wish to revoke such consent, please contact us by email at support@storybird.ai.',
				},
				{
					title: "",
					text: "Specifically, we use Personal Data for the following purposes:",
				},
				{
					title: "",
					text: "",
					list: [
						"To facilitate, operate, and provide our Service;",
						"To authenticate the identity of our Users, and to allow them to access our Service;",
						"To provide our Visitors, Users and Customers with assistance and support;",
						"To gain a better understanding on how Visitors and Users evaluate, use and interact with our Service, and how we could improve their and others’ user experience, and continue improving our products, offerings and the overall performance of our Service;",
						"To facilitate and optimize our marketing campaigns, ad management and sales operations, and to manage and deliver advertisements for our products and services more effectively, including on other Website(s) and applications. Such activities allow us to highlight the benefits of using our Service, and thereby to increase your engagement and overall satisfaction with our Service. This includes contextual, behavioral and interests-based advertising based on the Visitor’s or User’s activity, preferences or other data available to us or to our Service Providers and business partners;",
						"To explore and pursue growth opportunities by facilitating a stronger local presence and tailored experiences, including through partnerships with local distributors, resellers and providers of professional services related to our Service;",
						"To contact our Visitors, Users, and Customers (whether existing or prospective) with general or personalized service-related messages, as well as promotional messages that may be of specific interest to them (as further described in Section 6 below);",
						"To facilitate, sponsor and offer certain events, contests and promotions;",
						"To publish your feedback and submissions to our public forums and blogs;",
						"To support and enhance our data security measures, including for the purposes of preventing and mitigating the risks of fraud, error or any illegal or prohibited activity;",
						"To create aggregated statistical data, inferred non-personal data or anonymized or pseudonymized data (rendered non-personal), which we or our business partners may use to provide and improve our respective services, or for any other purpose; and",
						"To comply with applicable laws and regulations.",
					],
				},
				{
					title: "",
					text: "We do not sell your personal information for the intents and purposes of the California Consumer Privacy Act (CCPA). ",
				},
			],
		},
		{
			title: "Data Location & Retention",
			subsections: [
				{
					title: "",
					text: "We store your data in multiple locations around the world, for as long as necessary in accordance with our reasonable business needs (as necessary for the performance of our Service or for supporting and exercising our legitimate interests); and in accordance with our legal obligations.",
				},
				{
					title: "Data Location",
					text: "We and our authorized Service Providers (defined below) maintain, store and process Personal Data in the United States, and other locations as reasonably necessary for the proper performance and delivery of our Service, or as may be required by law.",
				},
				{
					title: "",
					text: "Authorly is headquartered in Seattle, Washington, in the United States of America, and we do not presently have any customers in the European Union that we are aware of. While privacy laws may vary between jurisdictions, Authorly, its affiliates and Service Providers are each committed to protect Personal Data in accordance with this Privacy Policy, customary industry standards, and such appropriate lawful mechanisms and contractual terms requiring adequate data protection, regardless of any lesser legal requirements that may apply in the jurisdiction from which such data originated.  Notwithstanding the foregoing, Customer Data may only be processed in such locations as permitted in our Data Processing Addendum and other commercial agreements with such Customer.",
				},
				{
					title: "Data Retention",
					text: "We will retain your Personal Data for as long as it is reasonably necessary in order to maintain and expand our relationship and provide you with our Service and offerings; in order to comply with our legal, tax, and contractual obligations; or to protect ourselves from any potential disputes (i.e. as required by laws applicable to log-keeping, records and bookkeeping, and in order to have proof and evidence concerning our relationship, should any legal issues arise following your discontinuance of use), all in accordance with our data retention policy.",
				},
				{
					title: "",
					text: "Please note that except as required by applicable law or our specific agreements with you, we will not be obligated to retain your Personal Data for any particular period, and we are free to securely delete it or restrict access to it for any reason and at any time, with or without notice to you. If you have any  questions   about  our   data   retention   policy,   please   contact   us   by   email at support@storybird.ai.",
				},
			],
		},
		{
			title: "Data Sharing",
			subsections: [
				{
					title: "",
					text: "We share your data (& feedback) with our Service Providers; our Customers; within our group; in accordance with legal compliance and amongst Users on your shared boards.",
				},
				{
					title: "Legal Compliance",
					text: "In exceptional circumstances, we may disclose or allow government and law enforcement officials access to your Personal Data, in response to a subpoena, search warrant, or court order (or similar requirement), or in compliance with applicable laws and regulations. Such disclosure or access may occur if we believe in good faith that: (a) we are legally compelled to do so; (b) disclosure is appropriate in connection with efforts to investigate, prevent, or take action regarding actual or suspected illegal activity, fraud, or other wrongdoing; or (c) such disclosure is required to protect the security or integrity of our products and services.",
				},
				{
					title: "Service Providers",
					text: "We may engage selected third party companies and individuals to perform services complementary to our own. Such service providers include providers of Third Party Services (as defined in the Terms hosting and server co-location services, communications and content delivery networks (CDNs), data and cyber security services, billing and payment processing services, fraud detection and prevention services, web analytics, e-mail distribution and monitoring services, session or activity recording services, remote access services, performance measurement, data optimization and marketing services, social and advertising networks, content providers, e-mail, voicemails, support and customer relation management systems, resellers, distributors and providers of professional services related to our Service, and our legal, compliance and financial advisors (collectively, “Service Providers.“)",
				},
				{
					title: "",
					text: "These Service Providers may have access to your Personal Data, depending on each of their specific roles and purposes in facilitating and enhancing our Service, and may only use it for such limited purposes as determined in our agreements with them.",
				},
				{
					title: "",
					text: "Our Service Providers shall be deemed as ‘Data Processors’ in circumstances where Authorly assumes the role of ‘Data Controller’; and where Authorly acts as the Data Processor for our Customer, the Service Provider shall be deemed our ‘Sub-Processor’ (as further described in Section 9 below).",
				},
				{
					title: "Third Party Website(s) and Services",
					text: "Our Service also includes links to third party Website(s), and integrations with Third Party Services (as defined in the Terms). Such Website(s) and Third Party Services, and any information you process, submit, transmit or otherwise use with such Website(s) and Third Party Services, are governed by such third party’s terms and privacy practices and policies, and not by this Privacy Policy. We encourage you to carefully read the terms and privacy policies of such Website(s) and Third Party Services.",
				},
				{
					title: "Sharing Personal Data With our Customers and Other Users",
					text: "We may share your Personal Data with the Customer owning the Account to which you are subscribed as an User (including data and communications concerning your User Profile). In such cases, sharing such data means that the Account’s Admin(s) may access it on behalf of the Customer, and will be able to monitor, process and analyze your Personal Data. This includes instances where you may contact us for help in resolving an issue specific to a team of which you are a member (and which is managed by the same Customer).",
				},
				{
					title: "",
					text: "Any Customer Data, User Profile, User Data, or other content submitted by you to third parties as necessary may still be accessed, copied and processed by the Customer’s Admin(s). If you register or access the Service using an e-mail address at a domain that is owned by your employer or organization (our Customer), and another team within such Customer’s organization wishes to establish an account on the Service, certain information about you including your name, profile picture, contact info and general use of your account may become accessible to the Customer’s Admins and Users.",
				},
				{
					title: "Sharing Your Feedback or Recommendations",
					text: "If you submit a public review or feedback, note that we may (at our discretion) store and present your review to other users of our Website(s) and Service (including other Customers). If you wish to remove your public review, please contact us at support@storybird.ai. If you choose to send others an e-mail or message inviting them to use the Service, we will use the contact information you provide us to automatically send such an invitation email or message on your behalf. Your name and e-mail address may be included in the invitation email or message.  The Company reserves the right, in our sole discretion, to select (or not select) which public reviews, and/or feedback to use, publish, or to refrain from the same.  Your submission of reviews, and/or feedback constitutes consent to use the same without further permission, nor compensation of any kind or nature, and use the same in any manner consistent with our business interests.  Reviews and/or feedback that may be interpreted as foul, profane, slanderous, defamatory, bullying, bigoted, or otherwise inappropriate in our sole opinion, may not be used.",
				},
				{
					title: "Protecting Rights and Safety",
					text: "We may share your Personal Data with others if we believe in good faith that this will help protect the rights, property or personal safety of Authorly, any of our Users or Customers, or any members of the general public.",
				},
				{
					title: "Authorly Subsidiaries and Affiliated Companies",
					text: "We may share Personal Data internally within our group, for the purposes described in this Privacy Policy. In addition,  should Authorly or any of its subsidiaries, affiliates, parent, sister, daughter, or related entities undergo any change in control, including by means of merger, acquisition or purchase of substantially all of its assets, your Personal Data may be shared with the parties involved in such an event. For the avoidance of doubt, Authorly may share your Personal Data in additional manners, pursuant to your explicit approval, or if we are legally obligated to do so, or if we have successfully rendered such data non-personal and anonymous. We may transfer, share or otherwise use non-personal data at our sole discretion and without the need for further approval.",
				},
			],
		},
		{
			title: "Cookies and Tracking Technologies",
			subsections: [
				{
					title: "",
					text: "We and our Service Providers use cookies and other technologies for performance, tracking, analytics and personalization purposes.",
				},
				{
					title: "",
					text: "Our Website(s) and Service (including some of our Service Providers) utilize “cookies,” anonymous identifiers, container tags and other technologies in order for us to provide our Service and ensure that it performs properly, to analyze our performance and marketing activities, and to personalize your experience. Such cookies and similar files or tags may also be temporarily placed on your device. Certain cookies and other technologies serve to recall Personal Data, such as an IP address, previously indicated by a User.",
				},
				{
					title: "",
					text: "Please note that we do not change our practices in response to a “Do Not Track” signal in the HTTP header from a browser or mobile application, however, most browsers allow you to control cookies, including whether or not to accept them and how to remove them. You may set most browsers to notify you if you receive a cookie, or to block or remove cookies altogether.",
				},
			],
		},
		{
			title: "Communications",
			subsections: [
				{
					title: "",
					text: "We engage in service and promotional communications, through email, phone, SMS and notifications.",
				},
				{
					title: "Service Communications",
					text: "We may contact you with important information regarding our Service. For example, we may send you notifications (through any of the means available to us) of changes or updates to our Service, billing issues, service changes, log-in attempts or password reset notices, etc. Our Customers, and other Users on the same Account, may also send you notifications, messages and other updates regarding their or your use of the Service. You can control your communications and notifications settings from your User Profile settings. However, please note that you will not be able to opt-out of receiving certain service communications which are integral to your use (like password resets or billing notices).",
				},
				{
					title: "Promotional Communications",
					text: "We may also notify you about new features, additional offerings, events and special opportunities or any other information we think our Users will find valuable. We may provide such notices through any of the contact means available to us (e.g. phone, mobile or email), through the Service, or through our marketing campaigns on any other Website(s) or platforms. If you do not wish to receive such promotional communications, you may notify Authorly at any time by sending an e-mail to support@storybird.ai, changing your communications preferences in your User Profile settings, or by following the “unsubscribe”, “stop”, “opt-out” or “change email preferences” instructions contained in the promotional communications you receive.",
				},
			],
		},
		{
			title: "Data Security",
			subsections: [
				{
					title: "",
					text: "We secure your Personal Data using industry-standard physical, procedural and technical measures.",
				},
				{
					title: "",
					text: "In order to protect your Personal Data held with us, we are using industry-standard physical, procedural and technical security measures, including encryption as appropriate. However, please be aware that regardless of any security measures used, we cannot and do not guarantee the absolute protection and security of any Personal Data stored with us or with any third parties as described in Section 4 above.",
				},
			],
		},
		{
			title: "Data Subject Rights",
			subsections: [
				{
					title: "",
					text: "Individuals have rights concerning their Personal Data. You may exercise your rights by contacting us or your Account Admin.",
				},
				{
					title: "",
					text: "If EU General Data Protection Regulation (GDPR) or the California Consumer Privacy Act (CCPA) applies to you and you wish to exercise those rights under the applicable law, such as the right to request access to, and rectification or erasure of your Personal Data held with Authorly, or to restrict or object to such Personal Data’s processing, or to port such Personal Data, or the right to equal services and prices (each to the extent available to you under the laws which apply to you) – please contact us by email at support@storybird.ai.",
				},
				{
					title: "",
					text: "Please note that once you contact us by email, we may instruct you on how to fulfill your request independently through your User Profile settings; or may require additional information and documents, including certain Personal Data, in order to authenticate and validate your identity and to process your request. Such additional data will then be retained by us for legal purposes (e.g. as proof of the identity of the person submitting the request), in accordance with Section 3 above.",
				},
				{
					title: "",
					text: "If you would like to make any requests or queries regarding Personal Data we process on your Account owner’s (our Customer’s) behalf, please contact the Account’s Admin directly. For example, if you are an User who wishes to access, correct, or delete data processed by Authorly on behalf of a Customer, please direct your request to the relevant Customer.",
				},
			],
		},
		{
			title: "Data  Controller/Processor",
			subsections: [
				{
					title: "",
					text: "We are the Controller of our Visitors,’ Customers’ Personal Data that given to us when the Customer signs an agreement with us, and certain types of Authorized User Data; we are the Processor of any Personal Data contained in Customer Data, which includes User Data processed on behalf of our Customer.",
				},
				{
					title: "",
					text: "Certain data protection laws and regulations, such as the GDPR or the CCPA, typically distinguish between two main roles for parties processing Personal Data: the “Data Controller” (or under the CCPA, “business”), who determines the purposes and means of processing; and the “Data Processor” (or under the CCPA, “service provider”), who processes the data on behalf of the Data Controller (or business). Below we explain how these roles apply to our Service, to the extent that such laws and regulations apply. Notwithstanding the foregoing, currently, Authorly, does not fall under the ambit of the CCPA as a “business.”",
				},
				{
					title: "",
					text: "Authorly is the “Data Controller” of  its Visitors’ and Customers’ Personal Data,  as well as User Data consisting of profile and contact details, as well as  usage, preferences, engagement and analytics data. With respect to such data, we assume the responsibilities of Data Controller (solely to the extent applicable under law), as set forth in this Privacy Policy. In such instances, our Service Providers processing such data will assume the role of “Data Processor.”",
				},
				{
					title: "",
					text: "If any of our Users upload or submit Customer Data or other content to our Service which includes Personal Data (e.g., by submitting their own clients’ contact details to one of their Boards), such data will only be processed by Authorly on behalf of our Customer, which is the owner of the respective Account, along with all other User Data processed on such Customer’s behalf.",
				},
				{
					title: "",
					text: "In such instances, our Customer shall be deemed the “Data Controller” of such data, and Authorly will process such data on the Customer’s behalf, as its “Data Processor”, in accordance with its reasonable instructions, subject to our Terms, our Data Processing Addendum with such Customer (to the extent applicable) and other commercial agreements. Authorly’s Service Providers shall act as designated Sub-Processors in these instances. The Customer will be responsible for meeting any legal requirements applicable to Data Controllers (such as establishing a legal basis for processing and responding to Data Subject Rights requests concerning the data they control).",
				},
			],
		},
		{
			title: "Additional Notices",
			subsections: [
				{
					title: "",
					text: "We may update this policy from time to time; we are not responsible for other Website(s)’ or services’ privacy practices. Don’t hesitate to contact our Privacy Officer with any questions regarding privacy and data protection.",
				},
				{
					title: "Updates and Amendments",
					text: "We may update and amend this Privacy Policy from time to time by posting an amended version on our Service. The amended version will be effective as of the date it is published. When we make material changes to this Privacy Policy, we’ll provide Users with notice as appropriate under the circumstances, e.g., by displaying a prominent notice within the Service or by sending an email. Your continued use of the Service after the changes have been implemented will constitute your acceptance of the changes.",
				},
				{
					title: "External Links",
					text: "While our Service may contain links to other Website(s) or services, we are not responsible for their privacy practices. We encourage you to pay attention when you leave our Service for the website or application of such third parties, and to read the privacy policies of each and every website and service you visit. This Privacy Policy applies only to our Service.",
				},
				{
					title:
						"Our Service is Not Designed to Attract Children Under the Age of 13",
					text: "We do not knowingly collect Personal Data directly from children and do not wish to do so. If we learn that a person under the age of 13 is using the Service, we will attempt to prohibit and block such use and will make our best efforts to promptly delete any Personal Data stored with us with regard to such child. If you believe that we might have any such data, please contact us by email at support@authorly.ai.",
				},
				{
					title: "Questions, Concerns or Complaints",
					text: "If you have any comments or questions regarding our Privacy Policy, or if you have any concerns regarding your Personal Data held with us, please contact Authorly’s support at support@storybird.ai.",
				},
				{
					title: "",
					text: "Effective Date:  July 15, 2021",
				},
			],
		},
	],
};
