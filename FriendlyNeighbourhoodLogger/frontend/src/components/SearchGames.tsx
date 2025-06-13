import React, { useState } from "react";
import { fetchGameDetails, Game } from "../services/igdbService";

const SearchGames = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [gameData, setGameData] = useState<Game[]>([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const data = await fetchGameDetails(searchQuery);
        setGameData(data);
    };

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter game name"
            />
            <button onClick={handleSearch}>Search</button>

            {gameData.map(game => (
                <div key={game.id}>
                    <h2>{game.name}</h2>
                    {game.cover?.url && <img src={game.cover.url} alt={`${game.name} cover`} />}
                    <p>Genres: {game.genres?.map(g => g.name).join(", ")}</p>
                    <p>Release Date: {game.release_dates?.[0]?.date ? new Date(game.release_dates[0].date).toLocaleDateString() : "Unknown"}</p>                </div>
            ))}
        </div>
    );
};

export default SearchGames;