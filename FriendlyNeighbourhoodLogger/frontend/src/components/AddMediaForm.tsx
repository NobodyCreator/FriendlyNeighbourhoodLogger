"use client";

import React, { useState } from "react";
import axios from "axios";

export default function AddMediaForm() {
    const [mediaType, setMediaType] = useState("");
    const [mediaTitle, setMediaTitle] = useState("");
    const [mediaStatus, setMediaStatus] = useState("");
    const [error, setError] = useState<string | null>(null);


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
                mediaType: mediaTypeMap[mediaType], // Properly formatted enum
                mediaTitle, // Required field
                mediaStatus: mediaStatusMap[mediaStatus],
                dateFinished: new Date().toISOString(), // Ensuring a valid timestamp
                userId: "checkanator" // edit when user implementation is added

            });

            console.log("Media added:", response.data);
            alert("Media added successfully!");

            // Reset form after successful submission
            setMediaType("");
            setMediaTitle("");
            setMediaStatus("");
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

            <label className="block mb-2">
                Media Title:
                <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded"
                    placeholder="Enter the title"
                    required
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

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Media
            </button>

            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
}
