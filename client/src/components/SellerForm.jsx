import React from 'react'
import Login from './Login';

const SellerForm = () => {
    const isLoggedIn = localStorage.getItem('user_id');
    return (
        <div>
            <div>Sell this book</div>
            {!isLoggedIn ? (
                <div>
                    log in to sell the book
                    <Login /> 
                </div>
            ) : (
                <div>form</div>
            )}
        </div>
    )
}

export default SellerForm
