import React, { useState } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal';
import ContactSellerForm from '../components/ContactSellerForm';
import SellerForm from '../components/SellerForm';


const Main = () => {
    const [value, setValue] = useState('');
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const [listings, setListings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    //input
    const handleChange = (e) =>{
        setValue(e.target.value);
        setBook(null);
        setError('');
        setListings([]);
    }

    //search
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
                setBook(data.book);
                //exist sellers
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

    //click seller card, open modal to see more info
    const handleCardClick = (listing) => {
        setSelectedListing(listing);
        setModalContent('contact');
        setIsModalOpen(true);
    }

    //click sell, open modal to input more info
    const handleSellClick = () =>{
        setModalContent('sell');
        setIsModalOpen(true)
    }

    //refreshListing
    const refreshListings = async () => {
        try {
            const response = await fetch(`http://localhost:8000/search/isbn/${book.isbn}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to refresh listings');
            }
            if (data.success) {
                setListings(data.listings || []);
            }
        } catch (err) {
            console.error('Error refreshing listings:', err);
        }
    };

    return (
        <div className='min-h-screen bg-base-200 p-4'>
            {/* search */}
            <form 
                className='flex flex-col gap-4 w-full max-w-md mx-auto font-medium'
                onSubmit={handleSubmit}>
                <input 
                    className="input input-bordered input-lg w-full"
                    type="text" 
                    placeholder='Enter ISBN (e.g., 9780134093413)'
                    onChange={handleChange}
                    value = {value}
                    disabled={isLoading}
                />
                <button className='btn btn-primary btn-lg'
                    type='submit'
                    disabled={!value.trim() || isLoading}
                    >{isLoading ? 'Searching...' : 'Search'}
                </button>      
            </form>

            {/* book, with sell button */}
            {book && (
                <div className='card bg-base-200 shadow-xl p-6 max-w-4xl mx-auto items-center'>
                    <div>
                        {book.cover_url && (
                            <figure>
                                <img src={book.cover_url} alt={book.title} className="max-w-xs rounded-lg shadow-md" />
                            </figure>
                        )}
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-bold">{book.title}</h2>
                        <ul className="mt-4 space-y-2">
                            <li>ISBN: {book.isbn}</li>
                            {book.publisher && <li>Publisher: {book.publisher}</li>}
                            {book.authors && <li>Authors: {book.authors}</li>}
                        </ul>
                    </div>
            
                    <div className='lex justify-center mt-6'>
                        <button 
                            className='btn btn-primary'
                            onClick={handleSellClick}>
                            Sell this book
                        </button>
                    </div>   
                </div>
            )}

            {/* seller listings */}
            {book && !isLoading && (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listings.length > 0 ? (
                        listings.map(listing => (
                            <div key={listing.listing_id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                <Card 
                                    listing={listing}
                                    onClick={() => handleCardClick(listing)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Card listing={null} />
                        </div>
                    )}
                </div>
            </div>
            )}
                
            {/* Modal*/}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                {modalContent === 'contact' && (
                    <ContactSellerForm 
                        listing={selectedListing}
                        book={book}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
                {modalContent === 'sell' && (
                    <SellerForm
                        isbn={book.isbn}
                        onClose = { () => {
                            refreshListings();
                            setIsModalOpen(false);
                        }}
                    />
                )}
            </Modal>

            {error && <div>{error}</div>}
        </div>
        
    )
}
export default Main