export enum AmazonMarketplace {
	US = "US",
	CA = "CA",
	MX = "MX",
	BR = "BR",
	DE = "DE",
	FR = "FR",
	IT = "IT",
	ES = "ES",
	AU = "AU",
	IN = "IN",
	JP = "JP",
	NL = "NL",
	UK = "UK",
}

export enum AmazonPublishLifecycle {
	None = -1,
	Requested,
	Processing,
	Published,
	Rejected,
	SelfPublished,
}

export const MARKET_PLACES = [
	{ key: "https://www.amazon.com", value: AmazonMarketplace.US },
	// { key: 'https://www.amazon.in', value: AmazonMarketplace.IN },
	{ key: "https://www.amazon.co.uk", value: AmazonMarketplace.UK },
	{ key: "https://www.amazon.de", value: AmazonMarketplace.DE },
	// { key: "https://www.amazon.fr", value: AmazonMarketplace.FR },
	{ key: "https://www.amazon.es", value: AmazonMarketplace.ES },
	{ key: "https://www.amazon.it", value: AmazonMarketplace.IT },
	// { key: "https://www.amazon.nl", value: AmazonMarketplace.NL },
	// { key: "https://www.amazon.co.jp", value: AmazonMarketplace.JP },
	// { key: "https://www.amazon.com.br", value: AmazonMarketplace.BR },
	// { key: "https://www.amazon.ca", value: AmazonMarketplace.CA },
	// { key: "https://www.amazon.com.mx", value: AmazonMarketplace.MX },
	// { key: "https://www.amazon.com.au", value: AmazonMarketplace.AU },
];
