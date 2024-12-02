import React from 'react'

const Card = ({ listing, onClick }) => {
    if(!listing) {
        return null
    }

    return (
        <div onClick = {() => onClick(listing)}>
        <h3>Seller: {listing.user_name}</h3>
            <div>
                <p>Price: ${listing.price}</p>
                <p>Condition: {listing.condition_percent}% new</p>
                <p>Delivery Method: {listing.deal_method}</p>
                {listing.notes && <p>Notes: {listing.notes}</p>}
                <p>Listed on: (listing.created_at)</p>
            </div>
        </div>
    )
}

export default Card

