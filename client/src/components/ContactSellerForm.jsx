import React from 'react'
import Login from './Login'

const ContactSellerForm = ({ listing, book }) => {
    const isLoggedIn = localStorage.getItem('user_id');

    if (!listing || !book) {
        return null;
    }
    
    return (
        <div>
            <div>contact seller</div>
            {!isLoggedIn ? (
                <div>
                    log in first to see contact information
                    <Login /> 
                </div>
            ) : (
                <ul>
                    <li>{book.title}</li>
                    <li>{book.authors}</li>
                    <li>{listing.price}</li>
                </ul>
            )}
        </div>
    )
}

export default ContactSellerForm