import React from "react";

const VideoSearch = () => {
    return (
        <div className="video-search">
            <input type="text" className="search-input w-6/12 mx-auto mt-10" placeholder="Search for a video" />
            <button className="search-button bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
        </div>
    )
}

export default VideoSearch;