"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { fetchGameDetails, Game } from "../services/igdbService";



const AddMediaForm = () => {
    const [mediaType, setMediaType] = useState("");
    const [mediaTitle, setMediaTitle] = useState("");
    const [mediaStatus, setMediaStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [gameData, setGameData] = useState<Game | null>(null);
    const [error, setError] = useState<string | null>(null);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debouncedFetch = useRef(
        debounce(async (query: string) => {
            const results = await fetchGameDetails(query);
            setSearchResults(results);
            setShowDropdown(true);
        }, 300)
    ).current;

    useEffect(() => {
        if (mediaType === "Game" && searchQuery.length > 1) {
            debouncedFetch(searchQuery);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [searchQuery, mediaType]);

    const handleSelectGame = (game: Game) => {
        setGameData(game);
        setMediaTitle(game.name);
        setSearchQuery(game.name);
        setShowDropdown(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target as Node)
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const mediaTypeMap: Record<string, number> = {
                Movie: 0,
                Show: 1,
                Book: 2,
                Game: 3
            };

            const mediaStatusMap: Record<string, number> = {
                Finished: 0,
                Started: 1,
                Backlogged: 2,
                Skipped: 3,
                Refunded: 4
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/add`, {
                mediaType: mediaTypeMap[mediaType],
                mediaTitle,
                mediaStatus: mediaStatusMap[mediaStatus],
                dateFinished: new Date().toISOString(),
                userId: "checkanator"
            });

            console.log("Media added:", response.data);

            window.dispatchEvent(new Event("mediaUpdated"));

            // Reset form
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
                <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded"
                    required
                >
                    <option value="" disabled>Select Media Type</option>
                    <option value="Movie">Movie</option>
                    <option value="Show">Show</option>
                    <option value="Book">Book</option>
                    <option value="Game">Game</option>
                </select>
            </label>

            {mediaType === "Game" && (
                <>
                    <label className="block mb-2">Game Search:</label>
                    <div ref={searchContainerRef} className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full mt-1 p-2 border rounded"
                            placeholder="Start typing a game..."
                            autoComplete="off"
                        />

                        {showDropdown && searchResults.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto">
                                {searchResults.map((game) => (
                                    <li
                                        key={game.id}
                                        onClick={() => handleSelectGame(game)}
                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                    >
                                        {game.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {gameData && (
                        <div className="mt-2">
                            <h3 className="text-lg font-semibold">{gameData.name}</h3>
                            {gameData.cover?.url && (
                                <img src={gameData.cover.url} alt={gameData.name} className="mt-2 w-32 h-32 object-cover" />
                            )}
                            <p className="text-sm text-gray-700">
                                {gameData.summary || "No description available."}
                            </p>
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
                    disabled={mediaType === "Game"}
                />
            </label>

            <label className="block mb-4">
                Media Status:
                <select
                    value={mediaStatus}
                    onChange={(e) => setMediaStatus(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded"
                    required
                >
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

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
};

export default AddMediaForm;
