import React, { useState } from 'react'

const Sell = () => {
    // search, same as main
    const[value, setValue] = useState('');
    const[book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    //sell
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search handlers, same as main
    const handleChange = (e) => {
        setValue(e.target.value);
        setBook(null);
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setBook(null);
        setError('');
    
        try {
            const response = await fetch(`http://localhost:8000/search/isbn/${value}`);
            const data = await response.json();
            
            if(!response.ok) {
                throw new Error(data.message || 'frontend, search/isbn fails')
            }
            if(data.success) {
                console.log('Received book data:', data.book);
                setBook(data.book);
            } else {
                setError(data.message);
            }
        } catch(err) {
            setError(err.message || 'frontend, search/isbn catch error');
        } finally {
            setIsLoading(false);
            setValue('');
        }
    }

    //sell handlers
    const handleSellSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // get user_id
        const user_id = localStorage.getItem('user_id')
        if(!user_id){
            setError('please log in to sell books')
            setIsSubmitting(false)
            return;
        }
        // get the other data
        const formData = {
            isbn: book.isbn,
            price: parseFloat(e.target.price.value),
            condition_percent: parseInt(e.target.condition_percent.value),
            deal_method: e.target.deal_method.value,
            notes: e.target.notes.value,
            contact: e.target.contact.value,
            user_id:user_id
        };

        // post api, save books if needed, save sell listing
        try {
            console.log('Form data to submit:', formData);
            const response = await fetch('http://localhost:8000/sell',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || 'frontend, fail to create listing');
            }
            setSubmitSuccess(true);
            e.target.reset();
        } catch (err) {
            setError('Failed to submit listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* search, same as main */}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='Enter ISBN (e.g., 9780134093413)'
                    onChange={handleChange}
                    value={value}
                    disabled={isLoading}
                />
                <button 
                    type='submit'
                    disabled={!value.trim() || isLoading}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {book && (
                <div>
                    <ul>
                        <li>Title: {book.title}</li>
                        {book.authors && <li>Authors: {book.authors}</li>}
                        {book.publisher && <li>Publisher: {book.publisher}</li>}
                        {book.publish_date && <li>Published: {book.publish_date}</li>}
                        {book.number_of_pages && <li>Pages: {book.number_of_pages}</li>}
                        <li>ISBN: {book.isbn}</li>
                        {book.cover_url && (
                            <li>
                                <img src={book.cover_url} alt={book.title} />
                            </li>
                        )}
                    </ul>
                    
                    {/* sell */}
                    <form onSubmit={handleSellSubmit}>
                        <div>
                            <label>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label>Condition (0-100%)</label>
                            <input
                                type="number"
                                name="condition_percent"
                                min="0"
                                max="100"
                                required
                            />
                        </div>

                        <div>
                            <label>Deal Method</label>
                            <select
                                name="deal_method"
                                defaultValue="in-person"
                                required
                            >
                                <option value="in-person">In Person</option>
                            </select>
                        </div>

                        <div>
                            <label>Contact (Email or Phone)</label>
                            <input
                                type="text"
                                name="contact"
                                required
                            />
                        </div>

                        <div>
                            <label>Notes (Optional)</label>
                            <textarea
                                name="notes"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'List Book for Sale'}
                        </button>
                    </form>

                    {submitSuccess && <div>Book listed successfully!</div>}
                </div>
            )}
            
            {error && <div>{error}</div>}
        </div>
    )
}

export default Sell