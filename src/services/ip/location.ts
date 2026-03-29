export interface IPLocationASN {
	organization: string;
}

export interface IPLocationData {
	country?: string;
	city?: string;
	continent?: string;
	asn?: IPLocationASN;
}

export const ipLocation = {
	API_URL: "https://api.country.is/{IP}?fields=city,continent,asn",

	fetchLocationData: async (ip: string): Promise<IPLocationData | null> => {
		try {
			const url = ipLocation.API_URL.replace("{IP}", ip);
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Failed to fetch Location Data from api");
			}
			const data: IPLocationData = await response.json();
			if (!data) {
				throw new Error("Invalid response data");
			}
			return data;
		} catch (error) {
			console.error("Error fetching IP location data", error);
			return null;
		}
	},
};
