"use client";
import { Button } from "@/components/ui/button";
import { Inter, Lancelot, Poppins } from "next/font/google";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../helpers/Footer";
import Navbar from "../helpers/Navbar";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import MovieCard from "../helpers/MovieCard";
import { ClipLoader } from "react-spinners";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "300"] });
const inter = Inter({ subsets: ["latin"] });
const lancelot = Lancelot({ subsets: ["latin"], weight: ["400"] });

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const [posters, setPosters] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    axios
      .get(`http://localhost:5000/user?username=${session.user.email}`, {
        withCredentials: true,
      })
      .then((response) => {
        setMovies(response.data["movie_titles"]);
        setPosters(response.data["movies_poster"]);
        setRatings(response.data["movie_ratings"]);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen text-white">
      <Navbar />

      <div className="relative">
        <img
          src="https://repository-images.githubusercontent.com/275336521/20d38e00-6634-11eb-9d1f-6a5232d0f84f"
          className="h-[400px] sm:h-[500px] lg:h-[700px] w-screen object-cover brightness-50"
          alt="MovieDB Hero"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${inter.className} text-center`}>
            <p className="text-4xl sm:text-5xl lg:text-6xl text-white">
              Welcome to{" "}
              <span className={`text-red-500 text-7xl font-bold ${lancelot.className}`}>
                MovieDB
              </span>
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl text-white m-4 sm:mt-6">
              Get personalized movie recommendations and have an amazing experience.
            </p>
            <div className="mt-6 sm:mt-10">
              <Link href="/user/recom">
                <Button variant="destructive" className="mx-2 w-[25%] h-10 sm:h-12">
                  Search for Movies
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black opacity-50"></div>
      </div>

      <div className="movies mt-40">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <ClipLoader color="#f00" size={50} />
            <p className="text-xl text-red-500">Fetching recommendations....</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <p className="text-5xl text-center text-red-500 underline">
              Based on your Watchlist
            </p>
            <div className="castcards mt-10">
              <Carousel
                className="w-full"
                opts={{
                  slidesToScroll: 1,
                  dots: true,
                  responsive: [
                    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
                    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                  ],
                }}
              >
                <CarouselContent className="mx-5">
                  {movies.map((movie, index) => (
                    <CarouselItem
                      className="lg:basis-1/3 md:basis-1/2 sm:basis-full"
                      key={index}
                    >
                      <MovieCard
                        movie={movie}
                        poster={posters[index]}
                        rating={ratings[index]}
                        movieClick={() => router.push(`/user/recom/${encodeURIComponent(movie)}`)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselDots />
              </Carousel>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 text-xl mt-10">Start adding movies in Watchlist to get more personalized recommendations.</p>
        )}

        <div className="gotosearch">
          <section className="max-w-6xl mx-auto my-16">
            <div className="ml-48 w-2/3">
              <div className="feature text-center p-10 bg-zinc-800 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Personalized Recommendations</h3>
                <p>Search for Movies and create your own personalized watchlist</p>
                <Link href="/user/recom">
                  <Button variant="destructive" className="mx-2 mt-5 h-10 sm:h-12">
                    Search for Movies
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
