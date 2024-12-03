import React, { useState } from 'react';
import Login from './Login';

const SellerForm = ({ isbn, onClose }) => {
    const user_id = localStorage.getItem('user_id');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        isbn: isbn,
        user_id: user_id,
        price: '',
        condition_percent: '',
        deal_method: 'in-person',
        contact_info: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('fetching')
            const response = await fetch('http://localhost:8000/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            console.log('fetch response', response)

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message || 'Failed to create listing');
            }
            console.log('response data', data)
            setSubmitSuccess(true);
            setFormData({
                isbn: isbn,
                user_id: user_id,
                price: '',
                condition_percent: '',
                deal_method: 'in-person',
                notes: ''
            });
            

            setTimeout(() => {
                onClose && onClose();
            }, 2000);

        } catch(err) {
            console.log(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Sell this book</h2>
            {!user_id ? (
                <div className="gap-5 text-gray-600 text-lg flex-col justify-items-center">
                    <p className='mb-5'>log in to sell the book</p>
                    <Login /> 
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6 inline-flex flex-col">
                        <div className="text-gray-600 focus-within:text-blue-500 focus-within:underline">
                            Selling price: 
                            <input 
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="ml-2 px-4 py-2 border rounded" 
                                type="number" 
                                placeholder="Enter price"
                                required
                            />
                            $
                        </div>
                        <div className="text-gray-600 focus-within:text-blue-500 focus-within:underline">
                            Book condition: 
                            <input 
                                name="condition_percent"
                                value={formData.condition_percent}
                                onChange={handleChange}
                                className="ml-2 px-4 py-2 border rounded" 
                                type="number" 
                                placeholder="0 - 100"
                                required
                            />
                            % new
                        </div>
                        <div className="text-gray-600 focus-within:text-blue-500 focus-within:underline">
                            Preferred method:
                            <select 
                                name="deal_method"
                                value={formData.deal_method}
                                onChange={handleChange}
                                className="px-4 py-2 border rounded"
                            >
                                <option value="in-person">in-person</option>
                            </select>
                        </div>
                        <div className="text-gray-600 focus-within:text-blue-500 focus-within:underline">
                            Contact info: 
                            <input 
                                name="contact_info"
                                value={formData.contact_info}
                                onChange={handleChange}
                                className="ml-2 px-4 py-2 border rounded" 
                                type="text" 
                                placeholder="Email or phone number"
                                required
                            />
                        </div>
                        <div className="text-gray-400 text-sm">
                            buyers will contact you this way
                        </div>
                        <div className="text-gray-600 focus-within:text-blue-500 focus-within:underline">
                            Other notes:
                            <input 
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="ml-2 px-4 py-2 border rounded" 
                                type="text" 
                                placeholder="Additional information"
                            />
                        </div>
                        
                        <button 
                            className="btn" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'SELL!'}
                        </button>
                    </form>
                    {submitSuccess && (
                        <div className="text-green-500 mt-4">
                            It's on selling list!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerForm;