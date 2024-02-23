import BrandShortLogo from "@/components/icons/brand-short-logo";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	LayoutGrid,
	Music,
	Radio,
} from "lucide-react";
import Image from "next/image";

const images = [
	"https://s3-alpha-sig.figma.com/img/df90/21a4/e692a49276e76580e568857e2e98ecfd?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=M8YPtAuPLlNk0hxZEUVte3QslxvEXaB4oCE~CKGSTELDpn9~0yElSFzbxR2o6kyT4IGx3HeKt0-Aa-YAOfCha3mBUW5I9pyvLCEU8R-jCq~R8TkgMZHW-dRxxahRuPS3ui1wNYvzWLPTE7X6PscEcV~FB5eP9nPWyMdvCgjDhrfw8Iwo-T64KzbZpIu8PFYUGeEBgYGuSmLOK-kOTbyDOopch8H2JaaId5E-NEna2gbXVlIr-wjKL0Kh34~1mWYJnAumIeIVkRPTPcoWnKduksrd3mzCHO6d78WQxar~6JTNveiz8Enws4d1PBgiRZ65jqWcKNNDnzsekL8SH9M~3Q__",
	"https://s3-alpha-sig.figma.com/img/4b74/a308/440aa6436990ba59544eec4ffcdc563e?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NQuNSbFJk~IubBDht3JCZXWMewISqVltZtHPQN~XOIoMhBzh8Syk7wfE8XAUEEjwrW-3qYgN~yWut8QsQzuVkqg5d01Y-TWO2sIAXRbIfgDFex--Ev~ZgkPxDGxciPhy16O4PehAB-g4eq9j~Qq9fPfLKFJuqj9tTVO-GzOqROI~cGrduXj6O6BrwkFWRzbVHBzOzzzXbWaXgpTb83SOa1Mw8xIx8ij7foDG8Gs4NSVw56HeJ6NtTasw15DSL3N16NWD6DNfox~X1q1O4Z0Ty235gmjYh9FdsNjoKCX6qPcoCjpuxqiKIoCJEl~Kmr9~p7ypcu2HTlQ0eNmYuBHt8Q__",
	"https://s3-alpha-sig.figma.com/img/37d6/3067/52049c46979d73390a22ddd36c091858?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jQxcQDduYjzAFCBraADR4Hh6LB0FpMIAYdzRhd0CqoBdC6TC6tdXP0~8mx7RRUGY7qeHGuc4p3QNqvQnm4OIhh8lnx6sVBIo7KeZxP89xIBTmbHVriNKyNQyucBBYt9aM72oNJ30MTTywI7j8RUnH-XmNRJKsPWrm3HhVdKRV6Iqb2DxWs5cVDHUpnIApxn16dG3KZgaXGchTF8dinm-Y5P-W17Gu218AeMrz9uzlNTa28iM38vBxKrm8O74OKGroY6XdhozST17dh6ouknWEI0qmmvxMcYacwZEjr-bJDWi1fZc6w0pVxYv8syc2RYHx51STgMiqWzbmfxTRasJzw__",
	"https://s3-alpha-sig.figma.com/img/f693/d943/4a89adb3a043999da9fd93a00f46d036?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHNVfsEyAMgYra620NFC5qLHp67xEp0lXuXdP3aDPJCkNECPqN51er1-J4f2imxeyu4Lf1lBbHoj3oQtxjpe2Xzv6Bq6mKt5Gfz16vDvG5LelsCkOelLaJJUO45i2PvkYbTZO7~-8LovqRDEan36E6x-JZxS4zmwcFIbVcXcc87ciNM6EoDdiG6UEhOLXn0W206d5YCO5TJwoRkrcgnINdwMNnAJs26zkwlf8GCIPVNZBRmI21DEwjg2N2rpWdcGgSmVUgocHekhxp8PO-HYESUwfaMxKhLlUMQxuGx9eqXxXtJlf-QaswTrZGu3FWXiyxbSMmtOm46ko9BL0WMLkA__",
	"https://s3-alpha-sig.figma.com/img/db3e/2276/a5d1b15a94d2b0e6350dee3a7c20ff16?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cVCnfj7qxDhPX9xAUXksB7-dC8-NDeZL30EKw5rGeYkYJ-CnF4dMrGflFfnyVUgfZ0z7O5s7YuVEs-Wy2lGkwSXFrQg8UYCo99kf3beKvVJ8~gfq0jH3fsLv~64rBVFVC0pGEuibP3ZTA2uCyrX6Fws2ry5JsEXm0iTlmInyNqz2n~l6uqMr7wXpOvX-8PQrVJz~cLeWFz8qGZjOBR60UMaK7VlKeoi1QScNc~lHEOjwFKWPSM6w0DCpbjVbifr-FpbzOmhuZBgctGgQFCn3hCwQ1-LUDycccnbuS3sKf8G2113cP3QmkeqfMul0scskop482kiKNEXGTTtgs7g3CA__",
	"https://s3-alpha-sig.figma.com/img/97c3/38ab/3840b8e82a3b15f65887698279769256?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BMYVki7bunQUrg~NoRX5~o9huPumsKjE1pYA1L6tHbvSdsfXdqTAp4zzp0IN8SphEnSIln2ZvlvYtjpf4N5STKBfgPVq4b6KWvjT8weDYM3kLi~bX7OLFn2N~-DRd5KFNfcbMAcMbZS4PCF8WVuXywLnf-bRbg7bMpyRYXkw7EluzZKkFozfutSLoqZxDKZsapMeuNb1TTPdD3NrmzHGeuxo5CbGz0YeBOJYInSe0mxnZJkjsbPS7WWdFKlHwxCeJiG74fN5wgG5hhfOUMW~exe79CkosefWuuHoBjYpJ0XIiFrq0pGHG8T0Zo0yzEsLRBJ5ogWLO8soekPenP6RMg__",
	"https://s3-alpha-sig.figma.com/img/a4f0/438b/9fd5442c1e9eb8d094a4188d4adc9fea?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jsvJq0~YWdDwXOImQPvDFl~rPY3nmOF1ToG8re6IhR7IXk9j9BjeYIayiicYEdyz41K~tP2PJYpA0hv~fTnODHWtvC1XoWCP6CC-3eJyQbtDmVXlqrBRgHXAP1QesdP02ng2k-5Zru7fEXUsEcLwgRCPmUVsTA1RAGxJ~QKqaJHRXQiouxitBl2RS8PCcHsluIwxppCJz40x4q8pWIHMX4Z925meQhEfsamVR4ldA6bDMxAVZlz0gV06Fm5y60zeCoeEdvHqvQpwWHUQf4HipSm9BWJE6hKRIH4NmxsZ~6qEScz-iLtyAP05Kbl7ep78Bqi8vy8tFA0ema5sRsq90w__",
	"https://s3-alpha-sig.figma.com/img/4b74/a308/440aa6436990ba59544eec4ffcdc563e?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NQuNSbFJk~IubBDht3JCZXWMewISqVltZtHPQN~XOIoMhBzh8Syk7wfE8XAUEEjwrW-3qYgN~yWut8QsQzuVkqg5d01Y-TWO2sIAXRbIfgDFex--Ev~ZgkPxDGxciPhy16O4PehAB-g4eq9j~Qq9fPfLKFJuqj9tTVO-GzOqROI~cGrduXj6O6BrwkFWRzbVHBzOzzzXbWaXgpTb83SOa1Mw8xIx8ij7foDG8Gs4NSVw56HeJ6NtTasw15DSL3N16NWD6DNfox~X1q1O4Z0Ty235gmjYh9FdsNjoKCX6qPcoCjpuxqiKIoCJEl~Kmr9~p7ypcu2HTlQ0eNmYuBHt8Q__",
	"https://s3-alpha-sig.figma.com/img/37d6/3067/52049c46979d73390a22ddd36c091858?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jQxcQDduYjzAFCBraADR4Hh6LB0FpMIAYdzRhd0CqoBdC6TC6tdXP0~8mx7RRUGY7qeHGuc4p3QNqvQnm4OIhh8lnx6sVBIo7KeZxP89xIBTmbHVriNKyNQyucBBYt9aM72oNJ30MTTywI7j8RUnH-XmNRJKsPWrm3HhVdKRV6Iqb2DxWs5cVDHUpnIApxn16dG3KZgaXGchTF8dinm-Y5P-W17Gu218AeMrz9uzlNTa28iM38vBxKrm8O74OKGroY6XdhozST17dh6ouknWEI0qmmvxMcYacwZEjr-bJDWi1fZc6w0pVxYv8syc2RYHx51STgMiqWzbmfxTRasJzw__",
	"https://s3-alpha-sig.figma.com/img/f693/d943/4a89adb3a043999da9fd93a00f46d036?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHNVfsEyAMgYra620NFC5qLHp67xEp0lXuXdP3aDPJCkNECPqN51er1-J4f2imxeyu4Lf1lBbHoj3oQtxjpe2Xzv6Bq6mKt5Gfz16vDvG5LelsCkOelLaJJUO45i2PvkYbTZO7~-8LovqRDEan36E6x-JZxS4zmwcFIbVcXcc87ciNM6EoDdiG6UEhOLXn0W206d5YCO5TJwoRkrcgnINdwMNnAJs26zkwlf8GCIPVNZBRmI21DEwjg2N2rpWdcGgSmVUgocHekhxp8PO-HYESUwfaMxKhLlUMQxuGx9eqXxXtJlf-QaswTrZGu3FWXiyxbSMmtOm46ko9BL0WMLkA__",
	"https://s3-alpha-sig.figma.com/img/db3e/2276/a5d1b15a94d2b0e6350dee3a7c20ff16?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cVCnfj7qxDhPX9xAUXksB7-dC8-NDeZL30EKw5rGeYkYJ-CnF4dMrGflFfnyVUgfZ0z7O5s7YuVEs-Wy2lGkwSXFrQg8UYCo99kf3beKvVJ8~gfq0jH3fsLv~64rBVFVC0pGEuibP3ZTA2uCyrX6Fws2ry5JsEXm0iTlmInyNqz2n~l6uqMr7wXpOvX-8PQrVJz~cLeWFz8qGZjOBR60UMaK7VlKeoi1QScNc~lHEOjwFKWPSM6w0DCpbjVbifr-FpbzOmhuZBgctGgQFCn3hCwQ1-LUDycccnbuS3sKf8G2113cP3QmkeqfMul0scskop482kiKNEXGTTtgs7g3CA__",
	"https://s3-alpha-sig.figma.com/img/97c3/38ab/3840b8e82a3b15f65887698279769256?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BMYVki7bunQUrg~NoRX5~o9huPumsKjE1pYA1L6tHbvSdsfXdqTAp4zzp0IN8SphEnSIln2ZvlvYtjpf4N5STKBfgPVq4b6KWvjT8weDYM3kLi~bX7OLFn2N~-DRd5KFNfcbMAcMbZS4PCF8WVuXywLnf-bRbg7bMpyRYXkw7EluzZKkFozfutSLoqZxDKZsapMeuNb1TTPdD3NrmzHGeuxo5CbGz0YeBOJYInSe0mxnZJkjsbPS7WWdFKlHwxCeJiG74fN5wgG5hhfOUMW~exe79CkosefWuuHoBjYpJ0XIiFrq0pGHG8T0Zo0yzEsLRBJ5ogWLO8soekPenP6RMg__",
	"https://s3-alpha-sig.figma.com/img/a4f0/438b/9fd5442c1e9eb8d094a4188d4adc9fea?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jsvJq0~YWdDwXOImQPvDFl~rPY3nmOF1ToG8re6IhR7IXk9j9BjeYIayiicYEdyz41K~tP2PJYpA0hv~fTnODHWtvC1XoWCP6CC-3eJyQbtDmVXlqrBRgHXAP1QesdP02ng2k-5Zru7fEXUsEcLwgRCPmUVsTA1RAGxJ~QKqaJHRXQiouxitBl2RS8PCcHsluIwxppCJz40x4q8pWIHMX4Z925meQhEfsamVR4ldA6bDMxAVZlz0gV06Fm5y60zeCoeEdvHqvQpwWHUQf4HipSm9BWJE6hKRIH4NmxsZ~6qEScz-iLtyAP05Kbl7ep78Bqi8vy8tFA0ema5sRsq90w__",
];

const Footer = () => {
	return (
		<div className="flex sticky bottom-0 bg-background border-border border-t-[1px] p-3 pt-1.5 justify-between items-center overflow-hidden">
			<div className="flex gap-1">
				<div>
					<label className="text-sm text-slate-600 font-normal">Narrator</label>
					<Select>
						<SelectTrigger className="max-w-fit py-1.5 px-3">
							<Radio className="stroke-1 opacity-50" />
							<SelectValue placeholder="Classic Male voice" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="male">Classic Male voice</SelectItem>
							<SelectItem value="female">Classic Female voice</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Select>
						<label className="text-sm text-slate-600 font-normal">Music</label>
						<SelectTrigger className="max-w-fit py-1.5 px-3 space-x-1.5">
							<Music className="stroke-1 opacity-50" />
							<SelectValue placeholder="None" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">None</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="text-center max-w-md">
				<span className="text-sm font-normal">
					<span className="text-slate-600">Primary Image Style:</span>{" "}
					<span className="text-purple-600">Cartoon</span>
				</span>

				<div className="flex space-x-1 items-center">
					<ChevronLeft className="w-8 h-8 opacity-50" />
					<div className="flex overflow-x-scroll">
						<div className="flex gap-x-1">
							{images.map((image, index) => (
								<div
									key={index}
									className="w-16 h-12 rounded-lg"
									style={{
										background: `url(${image})`,
										backgroundSize: "cover",
										backgroundRepeat: "no-repeat",
										boxShadow:
											"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
										backdropFilter: "blur(5px)",
									}}
								/>
							))}
						</div>
					</div>
					<ChevronRight className="w-8 h-8 opacity-50" />
				</div>
			</div>

			<div className="flex gap-2">
				<div>
					<Select>
						<label className="text-sm text-slate-600 font-normal">
							Storyboard Images
						</label>
						<SelectTrigger className="max-w-fit py-1.5 px-3 space-x-1.5">
							<LayoutGrid className="stroke-1 opacity-50" />
							<SelectValue placeholder="Batch Generate All" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">None</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col">
					<label className="text-sm text-slate-600 font-normal text-right">
						~30s to Generate Storyboard
					</label>
					<Button className="bg-purple-700 space-x-1.5">
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Generate Storyboard</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Footer;
