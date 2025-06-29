import React, { useEffect, useState } from 'react';
import { mediaTypeLabels, mediaStatusLabels } from "../src/utils/mediaLabels";
import axios from 'axios';
import MediaModal from "../src/components/MediaModal";
import AddMediaForm from "../src/components/AddMediaForm";
import EditMediaModal from "../src/components/EditMediaModal";

interface Media {
    id: number;
    mediaTitle: string;
    mediaType: string;
    mediaStatus: string;
    dateFinished: string;
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


            <ul>
                {mediaList.map((media) => (
                    <li key={media.id}>
                        {media.mediaTitle} ({mediaTypeLabels[Number(media.mediaType)] || "Unknown"} -{" "}
                        {mediaStatusLabels[Number(media.mediaStatus)] || "Unknown"})
                        {Number(media.mediaStatus) === 0 && (
                            <p className="text-gray-500">Finished on: {new Date(media.dateFinished).toLocaleDateString()}</p>
                        )}

                        {/* Open edit modal */}
                        <button onClick={() => setSelectedMedia(media)} className="bg-yellow-500 text-white p-2 rounded">
                            Edit
                        </button>
                    </li>
                ))}
            </ul>

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


