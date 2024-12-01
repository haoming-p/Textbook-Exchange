import React, { useState } from 'react'

const Main = () => {
    const[value, setValue] = useState('');
    const[book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')

    const handleChange = (e) =>{
        setValue(e.target.value);
        setBook(null);
        setError('')
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        setBook(null)
        setError('')
    
        try{
            const response = await fetch(`http://localhost:8000/search/isbn/${value}`);
            const data = await response.json();
            
            if(!response.ok){
                throw new Error(data.message || 'frontend, search/isbn fails')
            }
            if(data.success){
                console.log('Received book data:', data.book);
                setBook(data.book);
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

    return (
        <div>
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
            {error && <div>{error}</div>}
        </div>
        
    )
}
export default Main
