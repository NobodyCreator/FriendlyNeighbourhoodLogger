import axios from "axios";

const IGDB_API_URL = "https://api.igdb.com/v4/games";
const CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN;

export interface Game {
    id: number;
    name: string;
    summary?: string;
    genres?: { name: string }[];
    cover?: { url: string };
    release_dates?: { date: number }[];
}

export const fetchGameDetails = async (gameName: string): Promise<Game[]> => {
    try {
        const response = await axios.post<Game[]>(
            IGDB_API_URL,
            `search "${gameName}"; fields id, name, summary, genres.name, cover.url, release_dates.date;`,
            {
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${ACCESS_TOKEN}`
                }
            }
        );

        console.log("Game Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching game details:", error);
        return [];
    }
};