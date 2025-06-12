"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lancelot } from 'next/font/google';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Footer from '@/app/helpers/Footer';
import Navbar from '@/app/helpers/Navbar';
import { ClipLoader } from 'react-spinners';
import { Modal } from '@/app/helpers/Modal';
import { debounce } from 'lodash';

const lancelot = Lancelot({ weight: ["400"], subsets: ["latin-ext"] });

const Recom = () => {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');
    const { data: session } = useSession({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const fetchSuggestions = async (value) => {
        if (value.length > 2) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/autocomplete?query=${value}`);
                setSuggestions(response.data.movies.filter(movie => movie.toLowerCase().includes(value.toLowerCase())));
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]); 
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    const onChange = (event) => {
        const value = event.target.value;
        setInput(value);
        debouncedFetchSuggestions(value); 
    };

    const handleSuggestionClick = (movie) => {
        setInput(movie); 
        setSuggestions([]); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (session.user) {
            axios.post('http://localhost:5000/recom', { movie_name: input }, { withCredentials: true })
                .then((response) => {
                    console.log(response.data);
                    router.push(`/user/recom/${input}`);
                })
                .catch((err) => {
                    setError(err.response.data.error);
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <div>
            <header>
                <Navbar />
            </header>
            {error && (
                <Modal isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} errormsg={error} />
            )}
            <p className={`text-6xl mt-20 text-white text-center ${lancelot.className}`}>MovieDB Recommender</p>
            <form onSubmit={handleSubmit}>
                <div className="text-white flex flex-col items-center justify-center">
                    <div className="ip mt-48 w-full flex flex-col items-center">
                        <Label className='text-2xl'>Enter a Movie:</Label>
                        <Input 
                            value={input} 
                            onChange={onChange} 
                            className='mt-4 w-2/3 bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40' 
                            required 
                        />
                        {suggestions.length > 0 && (
                            <ul className="bg-zinc-700 w-2/3 rounded-lg shadow-lg z-10">
                                {suggestions.map((movie, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(movie)} className="p-2 cursor-pointer hover:bg-zinc-600">
                                        {movie}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Button variant='destructive' type='submit' className='w-[120px] mt-10' disabled={loading}>
                        {loading ? <ClipLoader color="#fff" size={20} /> : "Search Movie"}
                    </Button>
                </div>
            </form>
            <div className="footer mt-96">
                <Footer />
            </div>
        </div>
    );
}

export default Recom;
