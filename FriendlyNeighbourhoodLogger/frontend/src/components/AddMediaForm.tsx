import React, { useState } from "react";
import axios from "axios";

export default function AddMediaForm() {
    const [mediaType, setMediaType] = useState("");
    const [mediaTitle, setMediaTitle] = useState("");
    const [mediaStatus, setMediaStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5058/api/media", {
                mediaType,
                mediaTitle,
                mediaStatus,
            });

            console.log("Media logged:", response.data);
            alert("Media logged successfully!");

            setMediaType("");
            setMediaTitle("");
            setMediaStatus("");
        } catch (error) {
            console.error("Error logging media:", error);
            alert("Failed to log your media. Please try again.");
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
                    <option value="Song">Song</option>
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
                >
                    <option value="" disabled>Select Status</option>
                    <option value="Finished">Finished</option>
                    <option value="Started">Started</option>
                    <option value="Backlogged">Backlogged</option>
                    <option value="Skipped">Skipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Refunded">Refunded</option>
                </select>
            </label>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Media
            </button>
        </form>
    );
}