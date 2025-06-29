"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface Media {
    id: number;
    mediaTitle: string;
    mediaStatus: string | number;
    mediaType: number;
    dateFinished?: string;
}


interface EditMediaProps {
    media: Media;
    onCloseAction: () => void;
    onUpdateAction: () => void;
}


const mediaStatusMap: Record<string, number> = {
    Finished: 0,
    Started: 1,
    Backlogged: 2,
    Skipped: 3,
    Refunded: 4,
};





const reverseStatusMap = Object.fromEntries(
    Object.entries(mediaStatusMap).map(([k, v]) => [v, k])
);



export default function EditMediaModal({
    media,
    onCloseAction,
    onUpdateAction,
}: EditMediaProps) {
    const initialStatus =
        typeof media.mediaStatus === "string"
            ? media.mediaStatus
            : reverseStatusMap[media.mediaStatus] ?? "Started";

    const [mediaTitle, setMediaTitle] = useState(media.mediaTitle);
    const [mediaStatus, setMediaStatus] = useState<string>(initialStatus);
    const [dateFinished, setDateFinished] = useState<string>(
        media.dateFinished ||
        (initialStatus === "Finished"
            ? new Date().toISOString().split("T")[0]
            : "")
    );




    useEffect(() => {
        if (mediaStatus === "Finished" && !dateFinished) {
            setDateFinished(new Date().toISOString().split("T")[0]);
        } else if (mediaStatus !== "Finished") {
            setDateFinished(""); // wipe it out if switching away from "Finished"
        }
    }, [mediaStatus]);


    const handleUpdate = async () => {
        try {
            const payload = {
                mediaTitle,
                mediaStatus: mediaStatusMap[mediaStatus],
                mediaType: media.mediaType, // explicit to avoid re-defaulting on update
                userId: "checkanator",
                ...(mediaStatus === "Finished"
                    ? {
                        dateFinished: dateFinished?.trim()
                            ? new Date(dateFinished).toISOString()
                            : new Date().toISOString(),
                    }
                    : { dateFinished: null }),
            };


            console.log("Sending payload:", JSON.stringify(payload, null, 2));

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/${media.id}`,
                payload
            );




            onUpdateAction();
            onCloseAction();
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(
                "Error updating media:",
                axiosError.response?.data || axiosError.message
            );
        }
    };





    const handleDelete = async () => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/${media.id}`
            );
            onUpdateAction();
            onCloseAction();
        } catch (error) {
            console.error("Error deleting media:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                <button
                    onClick={onCloseAction}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                >
                    ✖
                </button>

                <h2 className="text-lg font-bold mb-4">Edit Media Entry</h2>

                <label className="block mb-2">
                    Title:
                    <input
                        type="text"
                        value={mediaTitle}
                        onChange={(e) => setMediaTitle(e.target.value)}
                        className="border p-2 w-full"
                    />
                </label>

                <label className="block mb-2">
                    Status:
                    <select
                        value={mediaStatus}
                        onChange={(e) => setMediaStatus(e.target.value)}
                        className="border p-2 w-full"
                    >
                        {Object.keys(mediaStatusMap).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </label>

                {mediaStatus === "Finished" && (
                    <label className="block mb-2">
                        Finished Date:
                        <input
                            type="date"
                            value={dateFinished}
                            onChange={(e) => setDateFinished(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="border p-2 w-full"
                            required
                        />
                    </label>
                )}

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={mediaStatus === "Finished" && !dateFinished}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
