import React, { useEffect, useState } from 'react';
import { mediaTypeLabels, mediaStatusLabels } from "../src/utils/mediaLabels";
import axios from 'axios';
import MediaModal from "../src/components/MediaModal";
import AddMediaForm from "../src/components/AddMediaForm";

interface Media {
    id: number;
    mediaTitle: string;
    mediaType: string;
    mediaStatus: string;
    dateFinished: string;
}

console.log("Loaded API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const MediaPage: React.FC = () => {
    const [mediaList, setMediaList] = useState<Media[]>([]); // Set the correct type for state
    const [error, setError] = useState<string | null>(null); // Handle errors gracefully
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/all`)
            .then((response) => setMediaList(response.data))
            .catch((error) => {
                console.error("Error fetching media:", error);
                setError("Failed to fetch media. Please check the backend.");
            });
    }, []);



    return (
        <div>
            <h1>Media Tracker</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/*  Add button to open modal */}
            <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => setIsModalOpen(true)}>
                Add New Media
            </button>

            <MediaModal isOpen={isModalOpen} onCloseAction={() => setIsModalOpen(false)}>
                <AddMediaForm />
            </MediaModal>


            <ul>
                {mediaList.map((media) => (
                    <li key={media.id}>
                        {media.mediaTitle} ({mediaTypeLabels[Number(media.mediaType)] || "Unknown"} - {mediaStatusLabels[Number(media.mediaStatus)] || "Unknown"})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MediaPage;
