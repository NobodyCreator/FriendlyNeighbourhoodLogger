import React from "react";
import AddMediaForm from "../../components/AddMediaForm";

export default function MediaPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Media Tracker</h1>
            <AddMediaForm />
        </div>
    );
}