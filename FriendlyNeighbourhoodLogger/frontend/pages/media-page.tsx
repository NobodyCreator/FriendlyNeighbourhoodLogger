import React, { useEffect, useState } from 'react';
import { mediaTypeLabels, mediaStatusLabels } from "../src/utils/mediaLabels";
import axios from 'axios';
import MediaModal from "../src/components/MediaModal";
import AddMediaForm from "../src/components/AddMediaForm";
import EditMediaModal from "../src/components/EditMediaModal";

interface Media {
    id: number;
    mediaTitle: string;
    mediaType: number;
    mediaStatus: number;
    dateFinished: string;
    dateStarted?: string;
    userId: string;
    coverImageUrl?: string;
    genres?: string;
    description?: string;
}


console.log("Loaded API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const MediaPage: React.FC = () => {
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

    const MediaPage = () => {
        return (
            <div>
                <h1>Media Tracker</h1>
            </div>
        );
    };


    // Function to fetch media list from the backend
    const fetchMediaList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/all`);
            setMediaList(response.data);
        } catch (error) {
            console.error("Error fetching media list:", error);
            setError("Failed to fetch media. Please check the backend.");
        }
    };




    //  Fetch media list when the component loads
    useEffect(() => {
        fetchMediaList();

    }, []);



    // Function to refresh media list after edit/delete actions
    const onUpdateAction = () => {
        fetchMediaList(); // Refresh media list after changes
    };

    return (
        <div>
            <h1>Media Tracker</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Add button to open modal */}
            <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => setIsModalOpen(true)}>
                Add New Media
            </button>


            {/*  Add media modal */}
            <MediaModal isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)}>
                <AddMediaForm /> {/*  No props needed */}

            </MediaModal>


            <section className="grid gap-4">
                {mediaList.map((media) => (
                    <div key={media.id} className="border p-4 rounded shadow-sm bg-white flex gap-4">
                        <div className="flex flex-col items-center justify-start min-w-[80px]">
                            <span className="text-xs font-semibold text-gray-500 uppercase">
                                {mediaTypeLabels[+media.mediaType] || "Unknown"}
                            </span>
                            {media.coverImageUrl && (
                                <img
                                    src={media.coverImageUrl}
                                    alt={media.mediaTitle}
                                    className="w-24 h-24 object-cover mt-2 rounded"
                                />
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold">{media.mediaTitle}</h3>

                            {media.genres && (
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Genres:</span> {media.genres}
                                </p>
                            )}

                            {media.description && (
                                <p className="text-sm text-gray-700 mb-2">{media.description}</p>
                            )}

                            <div className="text-sm text-gray-500 flex flex-wrap items-center gap-3 mb-2">
                                <span>
                                    Status: <strong>{mediaStatusLabels[+media.mediaStatus]}</strong>
                                </span>
                                {media.dateStarted && (
                                    <span>
                                        Started on:{" "}
                                        {new Date(media.dateStarted).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}

                                {media.dateFinished && (
                                    <span>
                                        Finished on:{" "}
                                        {new Date(media.dateFinished).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>



                                )}
                                {/* Only show when user login is active */}
                                {/* <span>User: {media.userId}</span> */}
                            </div>
                            {media.dateStarted && media.dateFinished && (() => {
                                const start = new Date(media.dateStarted);
                                const end = new Date(media.dateFinished);
                                const diffHours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));

                                if (diffHours >= 0) {
                                    return (
                                        <p className="text-xs text-gray-600 italic">
                                            Finished in {diffHours} {diffHours === 1 ? "hour" : "hours"}
                                        </p>
                                    );
                                }
                                return null;
                            })()}

                            <button
                                onClick={() => setSelectedMedia(media)}
                                className="bg-yellow-500 text-white px-4 py-1 rounded"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Edit modal */}
            {selectedMedia && (
                <EditMediaModal
                    media={selectedMedia}
                    onCloseAction={() => setSelectedMedia(null)}
                    onUpdateAction={onUpdateAction} //  Ensures UI updates instantly
                />
            )}
        </div>
    );
};

export default MediaPage;


