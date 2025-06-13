"use client";

import React, { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";

interface Media {
    id: number;
    mediaTitle: string;
    mediaStatus: string;
    dateFinished?: string;
}

interface EditMediaProps {
    media: Media;
    onCloseAction: () => void;
    onUpdateAction: () => void;
}




export default function EditMediaModal({ media, onCloseAction, onUpdateAction }: EditMediaProps) {
    const [mediaTitle, setMediaTitle] = useState(media.mediaTitle);
    const [mediaStatus, setMediaStatus] = useState(media.mediaStatus);
    const [dateFinished, setDateFinished] = useState(media.dateFinished);

    const mediaStatusMap: Record<string, number> = {
        Finished: 0,
        Started: 1,
        Backlogged: 2,
        Skipped: 3,
        Refunded: 4
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                mediaTitle,
                mediaStatus: mediaStatusMap[mediaStatus],
                userId: "checkanator", 
                dateFinished: dateFinished ? new Date(dateFinished).toISOString() : "0001-01-01T00:00:00Z"
            };


            console.log("Sending request:", JSON.stringify(payload, null, 2));

            await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/${media.id}`, payload);

            onUpdateAction(); //  Let the parent component refresh media list
            onCloseAction();
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error updating media:", axiosError.response?.data || axiosError.message);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/${media.id}`);
            onUpdateAction(); //  Ensure parent updates after deletion
        } catch (error) {
            console.error("Error deleting media:", error);
        }
    };




    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button onClick={onCloseAction} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">✖</button>
                <h2>Edit Media Entry</h2>

                <label>
                    Title:
                    <input type="text" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} className="border p-2 w-full" />
                </label>

                <label>
                    Status:
                    <select value={mediaStatus} onChange={(e) => setMediaStatus(e.target.value)} className="border p-2 w-full">
                        <option value="Finished">Finished</option>
                        <option value="Started">Started</option>
                        <option value="Backlogged">Backlogged</option>
                        <option value="Skipped">Skipped</option>
                        <option value="Refunded">Refunded</option>
                    </select>
                </label>

                {mediaStatus === "Finished" && (
                    <label>
                        Finished Date:
                        <input type="date" value={dateFinished} onChange={(e) => setDateFinished(e.target.value)} className="border p-2 w-full" />
                    </label>
                )}

                <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
                    Delete
                </button>

                <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mt-4">Update</button>
            </div>
        </div>
    );
}
