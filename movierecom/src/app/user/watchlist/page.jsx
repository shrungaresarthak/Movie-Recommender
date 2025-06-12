"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../helpers/Navbar";
import { Lancelot, Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipLoader } from "react-spinners";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });
const lancelot = Lancelot({ weight: ["400"], subsets: ["latin-ext"] });

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const username = session.user.email;
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state added

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:5000/watchlist?username=${username}`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data.movies);
          setMovies(response.data.movies);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.response.data.message);
          setLoading(false);
        });
    }
  }, [username]);

  const removeMovie = async (movieName, moviePoster) => {
    try {
      const response = await axios.delete(`http://localhost:5000/watchlist`, {
        withCredentials: true,
        params: {
          username: username,
          title: movieName,
          poster: moviePoster,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.title !== movieName)
        );
      } else if (response.status === 404) {
        console.log(response.data);
        setError(response.data);
      } else {
        console.log(response.data);
      }
    } catch (e) {
      console.error("Error removing movie:", e);
    }
  };

  return (
    <div>
      <div className="min-h-screen">
        <Navbar />
        <div className="watchlist mt-10 text-white px-4 sm:px-8 md:px-12">
          <p
            className={`${lancelot.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center`}
          >
            My Watchlist
          </p>

          {loading && (
            <div className="flex justify-center mt-48">
              <ClipLoader size={70} color='red' loading={loading} />
            </div>
          )}

          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-28">
            {!loading && movies.length > 0 ? (
              movies.map((movie, index) => (
                <div
                  key={index}
                  className="movie1 flex flex-col md:flex-row items-center md:items-start mt-12 p-6 md:p-12 odd:bg-zinc-800 rounded-md"
                >
                  <img
                    src={movie.poster}
                    className="w-[150px] sm:w-[200px] md:w-[250px] rounded-md shadow-lg shadow-white"
                    alt=""
                  />
                  <div className="det md:ml-12 lg:ml-16 mt-6 md:mt-16 text-center md:text-left">
                    <p
                      className={`text-2xl sm:text-3xl md:text-4xl ${poppins.className}`}
                    >
                      {movie.title}
                    </p>
                    <div className="btns mt-6 md:mt-16 flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                      <Button
                        variant="destructive"
                        className="w-[150px] h-[40px] md:w-[120px] md:h-[50px] hover:bg-red-800"
                        onClick={() =>
                          router.push(
                            `/user/recom/${encodeURIComponent(movie.title)}`
                          )
                        }
                      >
                        View Details
                      </Button>
                      <Button
                        className="w-[175px] h-[40px] md:w-[175px] md:h-[50px] bg-blue-600 hover:bg-blue-800"
                        onClick={() => removeMovie(movie.title, movie.poster)}
                      >
                        Remove from Watchlist
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : !loading && error ? (
              <Alert variant="" className="shadow-none bg-slate-800 w-1/2 m-auto mt-24">
                <div className="flex items-center text-white">
                  <ExclamationTriangleIcon className="h-20 w-20" />
                  <AlertDescription className="text-2xl ml-5">{error}</AlertDescription>
                </div>
              </Alert>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
