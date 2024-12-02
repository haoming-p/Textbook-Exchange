import React, { useState } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal';
import ContactSellerForm from '../components/ContactSellerForm';

const Main = () => {
    const[value, setValue] = useState('');
    const[book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const [listings, setListings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    const handleChange = (e) =>{
        setValue(e.target.value);
        setBook(null);
        setError('');
        setListings([]);
    }
    <ContactSellerForm 
    listing={selectedListing}
    book={book}
    />

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        setBook(null);
        setError('');
        setListings([]);

        try{
            const response = await fetch(`http://localhost:8000/search/isbn/${value}`);
            const data = await response.json();
            
            if(!response.ok){
                throw new Error(data.message || 'frontend, search/isbn fails')
            }
            if(data.success){
                console.log('Received book data:', data.book);
                setBook(data.book);
                if (data.listings) {
                    setListings(data.listings);
                }
            }else{
                setError(data.message);
            }
        }catch(err){
            setError(err.message || 'frontend, search/isbn catch error');
        }finally{
            setIsLoading(false);
            setValue('')
        }
    }

    const handleCardClick = (listing) => {
        setSelectedListing(listing);
        setIsModalOpen(true);
    }

    return (
        <div>
            {/* search */}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='Enter ISBN (e.g., 9780134093413)'
                    onChange={handleChange}
                    value = {value}
                    disabled={isLoading}
                />
                <button 
                    type='submit'
                    disabled={!value.trim() || isLoading}
                    >{isLoading ? 'Searching...' : 'Search'}
                </button>      
            </form>

            {/* book */}
            {book && (
                <ul>
                    <li>Title: {book.title}</li>
                    {book.authors && <li>Authors: {book.authors}</li>}
                    {book.publisher && <li>Publisher: {book.publisher}</li>}
                    {book.publish_date && <li>Published: {book.publish_date}</li>}
                    {book.number_of_pages && <li>Pages: {book.number_of_pages}</li>}
                    <li>ISBN: {book.isbn}</li>
                    {book.cover_url && (<li> <img src={book.cover_url} alt={book.title} /></li>)}
                </ul>
            )}

            {/* seller,listings */}
            {listings.map(listing => (
                <Card 
                    key={listing.listing_id}
                    listing={listing}
                    onClick={handleCardClick}
                />
            ))}
            {listings.length === 0 && <p>No sellers available for this book</p>}
                
            {/* Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                {selectedListing && (
                    <ContactSellerForm 
                        listing={selectedListing}
                        book={book}
                    />
                )}
            </Modal>

            {error && <div>{error}</div>}
        </div>
        
    )
}
export default Main