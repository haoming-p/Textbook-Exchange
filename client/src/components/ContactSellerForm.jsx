import React from 'react'
import Login from './Login'

const ContactSellerForm = ({ listing, book, onClose }) => {
    const isLoggedIn = localStorage.getItem('user_id');

    if (!listing || !book) {
        return null;
    }
    
    return (
        <div className="p-4">
            <div className="text-xl font-bold mb-4">contact seller</div>
            {!isLoggedIn ? (
                <div className="gap-5 text-gray-600 text-lg flex-col justify-items-center">
                    <p className='mb-5'>log in first to see contact information</p>
                    <Login /> 
                </div>
            ) : (<div className='space-y-8'>
                    <div className="grid gap-3">
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Seller</span>
                            <span className="font-medium">{listing.user_name}</span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Price</span>
                            <span className="font-medium">${listing.price}</span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium">{listing.condition_percent}% new</span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Deal Method</span>
                            <span className="font-medium">{listing.deal_method}</span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Contact Info</span>
                            <span className="font-medium">{listing.contact_info}</span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Additional Notes</span>
                            <span className="font-medium">{listing.notes}</span>
                        </div> 
                
                    <button className='btn' onClick={onClose}>Got it</button>
                </div>
            </div>
            )}
        </div>
    )
}

export default ContactSellerForm