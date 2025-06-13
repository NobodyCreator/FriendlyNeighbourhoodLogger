"use client";

import React, { useState } from "react";
import axios from "axios";
import { fetchGameDetails } from "../services/igdbService";
import { Game } from "../services/igdbService";


const AddMediaForm = () => {
    const [mediaType, setMediaType] = useState("");
    const [mediaTitle, setMediaTitle] = useState("");
    const [mediaStatus, setMediaStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [gameData, setGameData] = useState<Game | null>(null);
    const [error, setError] = useState<string | null>(null);




    const handleSearch = async () => {
        if (mediaType !== "Game" || !searchQuery.trim()) return;
        const data = await fetchGameDetails(searchQuery);
        setGameData(data?.[0] || null); // Auto-fill with first result
        setMediaTitle(data?.[0]?.name || "");
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const mediaTypeMap: Record<string, number> = {
                Movie: 0,
                Show: 1,
                Book: 2,
                Game: 3
            };

            const mediaStatusMap: Record<string, number> =
            {
                Finished: 0,
                Started: 1,
                Backlogged: 2,
                Skipped: 3,
                Refunded: 4


            };
            const formattedMediaType = mediaTypeMap[mediaType];
            const formattedMediaStatus = mediaStatusMap[mediaStatus];


            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/add`, {
                mediaType: mediaTypeMap[mediaType],
                mediaTitle,
                mediaStatus: mediaStatusMap[mediaStatus],
                dateFinished: new Date().toISOString(),
                userId: "checkanator"
            });



            console.log("Media added:", response.data); 

            window.dispatchEvent(new Event("mediaUpdated"));
            // Reset form after successful submission
            setMediaType("");
            setMediaTitle("");
            setMediaStatus("");
            setSearchQuery("");
            setGameData(null);
        } catch (error) {
            console.error("Error adding media:", error);
            setError("Failed to add media. Please try again.");
        }
    };




    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-md">
            <h2 className="text-lg font-bold mb-4">Add New Media</h2>

            <label className="block mb-2">
                Media Type:
                <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} className="block w-full mt-1 p-2 border rounded" required>
                    <option value="" disabled>Select Media Type</option>
                    <option value="Movie">Movie</option>
                    <option value="Show">Show</option>
                    <option value="Book">Book</option>
                    <option value="Game">Game</option>
                </select>
            </label>

            {mediaType === "Game" && (
                <>
                    <label className="block mb-2">
                        Game Search:
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded"
                            placeholder="Enter game name"
                            required
                        />
                    </label>
                    <button type="button" onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Search Game
                    </button>

                    {/*  Auto-fill game details */}
                    {gameData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">{gameData.name}</h3>
                            {gameData.cover?.url && <img src={gameData.cover.url} alt={gameData.name} className="mt-2 w-32 h-32" />}
                            <p className="text-sm text-gray-700">{gameData.summary || "No description available."}</p>
                        </div>
                    )}
                </>
            )}

            <label className="block mb-2">
                Media Title:
                <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded"
                    placeholder="Enter the title"
                    required
                    disabled={mediaType === "Game"} //  Auto-filled for games
                />
            </label>

            <label className="block mb-4">
                Media Status:
                <select value={mediaStatus} onChange={(e) => setMediaStatus(e.target.value)} className="block w-full mt-1 p-2 border rounded" required>
                    <option value="" disabled>Select Status</option>
                    <option value="Finished">Finished</option>
                    <option value="Started">Started</option>
                    <option value="Backlogged">Backlogged</option>
                    <option value="Skipped">Skipped</option>
                    <option value="Refunded">Refunded</option>
                </select>
            </label>

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Add Media
            </button>

            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default AddMediaForm;

