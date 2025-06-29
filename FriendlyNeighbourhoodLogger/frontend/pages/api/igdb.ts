import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const rawSearch = req.query.search as string;


    if (!rawSearch?.trim()) {
        return res.status(400).json({ error: "Missing or empty search query" });
    }

    const query = rawSearch.trim().toLowerCase();

    const headers = {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Accept": "application/json"
    };

    const baseFields = "id, name, summary, cover.url, genres.name, release_dates.date";

    try {
        // First Attempt — normal search
        const searchBody = `search "${query}";\nfields ${baseFields};\nlimit 5;`;
        let response = await axios.post("https://api.igdb.com/v4/games", searchBody, { headers });

        // If no results, try fuzzy match using `where name ~ "*...*"`
        if (!response.data || response.data.length === 0) {
            const fuzzyBody = `where name ~ "*${query}*";\nfields ${baseFields};\nlimit 5;`;
            console.log("Checking for fuzzy search:", fuzzyBody);

            response = await axios.post("https://api.igdb.com/v4/games", fuzzyBody, { headers });
        }

        res.status(200).json(response.data);
    } catch (error: any) {
        console.error("IGDB Request Failed:", {
            message: error.message,
            code: error.code,
            responseStatus: error.response?.status,
            responseBody: error.response?.data,
        });

        res.status(500).json({
            error: "IGDB request failed",
            details: error.response?.data || error.message
        });
    }
}
