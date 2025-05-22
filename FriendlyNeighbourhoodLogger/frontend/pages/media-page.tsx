import React, { useEffect, useState } from 'react';
import { mediaTypeLabels, mediaStatusLabels } from "../src/utils/mediaLabels";
import axios from 'axios';

interface Media {
    id: number;
    mediaTitle: string;
    mediaType: string;
    mediaStatus: string;
    dateFinished: string;
}



const MediaPage: React.FC = () => {
    const [mediaList, setMediaList] = useState<Media[]>([]); // Set the correct type for state
    const [error, setError] = useState<string | null>(null); // Handle errors gracefully

    useEffect(() => {
        axios.get("https://localhost:7151/api/media/all")
            .then((response) => setMediaList(response.data))
            .catch((error) => {
                console.error("Error fetching media:", error);
                setError("Failed to fetch media. Please check the backend.");
            });
    }, []);




    return (
        <div>
            <h1>Media Tracker</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors if any */}
            <ul>
                {mediaList.map((media) => (
                    <li key={media.id}>
                        {media.mediaTitle} ({mediaTypeLabels[Number(media.mediaType)] || "Unknown"} - {mediaStatusLabels[Number(media.mediaStatus)] || "Unknown"})
                    </li>
                ))}
            </ul>

        </div>
    );
};


export default MediaPage;