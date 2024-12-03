import React from 'react'

const Card = ({ listing, onClick }) => {
    if(!listing|| !listing.user_id) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                    <div className="flex justify-center items-center h-24">
                        <span className="text-gray-500 text-lg">
                            No available sellers at this time
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return (
        <div 
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => onClick(listing)}
        >
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{listing.user_name}</span>
                    <span className="text-lg font-bold">${listing.price}</span>
                </div>
                
                <div className="text-gray-600">
                    Condition: {listing.condition_percent}% new
                </div>

                <div className="text-sm text-gray-500">
                    Listed on: {formatDate(listing.created_at)}
                </div>
            </div>
        </div>
    )
}

export default Card

