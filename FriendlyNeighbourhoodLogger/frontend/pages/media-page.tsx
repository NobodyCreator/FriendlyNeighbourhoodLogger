import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MediaPage: React.FC = () => {
    const [mediaList, setMediaList] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:5058/api/media-page') // Replace <ASP.NET-Port> with your backend port.
            .then((response) => setMediaList(response.data))
            .catch((error) => console.error('Error fetching media:', error));
    }, []);

    return (
        <div>
            <h1>Media Tracker</h1>
            <ul>
                {mediaList.map((media: any) => (
                    <li key={media.id}>{media.mediatitle}</li>
                ))}
            </ul>
        </div>
    );
};

export default MediaPage;