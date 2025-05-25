"use client";
import React, { useState } from "react";
import AddMediaForm from "./AddMediaForm"; 

interface ModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    children: React.ReactNode; 
}

export default function MediaModal({ isOpen, onCloseAction, children }: ModalProps) {
    if (!isOpen) return null; // Prevent rendering when closed

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button
                    onClick={onCloseAction}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
                </button>
                {children} {/* Embed child components here */}
            </div>
        </div>
    );
}
