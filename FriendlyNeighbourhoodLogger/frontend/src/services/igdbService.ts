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
        const response = await axios.get<Game[]>(`/api/igdb?search=${encodeURIComponent(gameName)}`);
        return response.data;
    } catch (error) {
        console.error("Proxy API error:", error);
        return [];
    }
};