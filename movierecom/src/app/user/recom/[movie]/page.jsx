"use client";

import Navbar from "@/app/helpers/Navbar";
import React, { useContext, useEffect, useState } from "react";
import { Inter, Lancelot, Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCross, FaPlay, FaSpinner } from "react-icons/fa";
import { IoClose, IoDownloadOutline } from "react-icons/io5";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import YouTube from "react-youtube";
import Footer from "@/app/helpers/Footer";
import MovieCard from "@/app/helpers/MovieCard";
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "300"] });
import { BiMoviePlay } from "react-icons/bi";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSession } from "next-auth/react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Modal } from "@/app/helpers/Modal";
import ClipLoader from "react-spinners/ClipLoader";

const lancelot = Lancelot({subsets:['latin'],weight:['400']})
const Recommend = ({ params }) => {
  const [movies, setMovie] = useState([]);
  const [poster, setPoster] = useState([]);
  const [details, setDetails] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [name, setName] = useState([]);
  const [char, setChar] = useState([]);
  const [rating, setRating] = useState([]);
  const [actorposter, setActorposter] = useState([]);
  const [reviews, setReview] = useState([]);
  const [sentiment, setSentiment] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [save, setSave] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleExpansion = (index) => {
    const newExpandedReviews = [...expandedReviews];
    newExpandedReviews[index] = !newExpandedReviews[index];
    setExpandedReviews(newExpandedReviews);
  };

  const opts = {
    height: "600",
    width: "1200",
  };
  const renderTrailer = () => {
    return <YouTube opts={opts} videoId={trailer.key} />;
  };

  const { movie: selectedMovie } = params;
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    redirect("/api/auth/signin");
  }

  useEffect(() => {
    if (selectedMovie) {
      setLoading(true)
      const response = axios
        .post(
          "http://127.0.0.1:5000/recom",
          { movie_name: decodeURIComponent(selectedMovie) },
          { withCredentials: true },

          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const data = response.data;
          setMovie(data[0]);
          setPoster(data[1]);
          setDetails(data[2]);
          console.log(data[2]);

          setTrailer(
            data[3].find(
              (vid) => vid.name === "Official Trailer" || vid.type === "Trailer"
            )
          );
          setName(data[4]["name"]);
          setChar(data[4]["character"]);
          setActorposter(data[4]["poster"]);
          setReview(data[5][0]);
          setSentiment(data[5][1]);
          setRating(data[6]);
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error);
          setLoading(false)
        });
    }
  }, [selectedMovie]);
  const saveMovie = async (movieName, movie_poster) => {
    console.log("Movie Name:", movieName);
    console.log("Movie Poster:", movie_poster);
    try {
      console.log("Sending request to the server...");

      const response = await axios.post(
        "http://localhost:5000/watchlist",
        {
          username: session.user.email,
          title: movieName,
          poster: movie_poster,
        },
        { withCredentials: true },

        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        console.log(response.data);
        setSave(true);
      }
    } catch (error) {
      console.error("Error saving movie", error);
      setIsDialogOpen(true);
      setError(error.response.data.message);
    }
  };

  return (
    <div>
  
  <Navbar />

      {loading ? (
                <div className="flex justify-center items-center min-h-screen">

        <ClipLoader size={70} color={"red"} loading={loading} />
        </div>
      ) : (
          <div>
            {" "}
            <div className="head relative bg-gray-900">
              <div
                className={`headercontent relative h-full flex flex-col md:flex-row  items-center md:items-start   px-4 md:px-20 p-10`}
              >
                <div className="poster">
                  <img
                    src={poster[0]}
                    className="h-[300px] md:h-[400px] lg:h-[500px] shadow-2xl shadow-white rounded-2xl"
                    alt="Poster"
                  />
                </div>
                <Modal
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  errormsg={error}
                />
                <div className="details mt-6 md:mt-0 md:ml-12 lg:ml-16 text-white w-full md:w-[60%] lg:w-[50%]">
                  <p
                    className={`${poppins.className} text-3xl md:text-4xl lg:text-5xl font-bold`}
                  >
                    {movies[0]}
                  </p>
                  <div className="flex items-center mt-4">
                    <StarFilledIcon className="w-9 h-9" color="yellow" />
                    <span className="rating text-3xl text-white ml-2">{`${details[3]}`}</span>
                  </div>
                  <p className="text-sm md:text-md lg:text-lg mt-10 ">
                    {details[1]}
                  </p>
                  <p className="release text-md md:text-lg lg:text-xl mt-4">
                    {details[0]}
                  </p>
                  <p className="release text-md md:text-lg lg:text-xl mt-4">
                    {details[2]}
                  </p>
                  <div className="btns mt-10 flex flex-col  sm:flex-row gap-4">
                    <Button
                      variant="destructive"
                      onClick={() => setShow(true)}
                      className="lg:w-1/2 "
                    >
                      <FaPlay className="mr-2" /> Watch Trailer
                    </Button>
                    <Button
                      className="lg:w-1/2  bg-blue-600 hover:bg-blue-800"
                      onClick={() => saveMovie(movies[0], poster[0])}
                    >
                      {save ? "Saved!" : "Save to Watchlist"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {show && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="fixed inset-0 bg-black opacity-50"
                  onClick={() => setShow(false)}
                ></div>
                <div className="relative z-50 bg-zinc-800 p-6 rounded-lg w-[90%] md:w-auto">
                  <div className="upper flex items-center mb-4">
                    <BiMoviePlay className="text-3xl text-white" />
                    <p
                      className={` ${poppins.className} text-2xl md:text-3xl ml-3 font-bold text-white`}
                    >
                      {movies[0]}
                    </p>
                  </div>
                  <div className="yt">{renderTrailer()}</div>
                  <Button
                    variant="destructive"
                    onClick={() => setShow(false)}
                    className="mt-4"
                  >
                    <IoClose className="mr-2" /> Close
                  </Button>
                </div>
              </div>
            )}
            <div className="main mt-16 md:mt-20 text-white px-4 transition-all">
              <p
                className={`${lancelot.className} text-5xl md:text-6xl lg:text-7xl text-red-600 underline text-center`}
              >
                Top Cast
              </p>
              <div className="castcards mt-10">
                <Carousel
                  className="w-full"
                  opts={{
                    slidesToScroll: 1,
                    dots: true,
                    responsive: [
                      {
                        breakpoint: 1024, // lg
                        settings: {
                          slidesToShow: 3,
                          slidesToScroll: 3,
                        },
                      },
                      {
                        breakpoint: 768, // md
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 2,
                        },
                      },
                      {
                        breakpoint: 640, // sm
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                    ],
                  }}
                >
                  <CarouselContent className="mx-5">
                    {name.map((actor, index) => (
                      <CarouselItem
                        className="lg:basis-1/3  md:basis-1/2 sm:basis-full"
                        key={index}
                      >
                        <div className="card  p-10 md:p-20">
                          <Card className="w-full h-full p-5 rounded-none border-none shadow-lg shadow-white/50 bg-zinc-800">
                            <CardHeader>
                              <img
                                src={actorposter[index]}
                                className="rounded-sm"
                                alt={actor}
                              />
                              <CardTitle
                                className={`${poppins.className} text-white text-lg md:text-xl pt-3 md:pt-5`}
                              >
                                {actor} as {char[index]}
                              </CardTitle>
                            </CardHeader>
                            <CardFooter className="p-0 mt-5">
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  router.push(
                                    `/user/castdetails/${encodeURIComponent(
                                      actor
                                    )}`
                                  )
                                }
                              >
                                Know More
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselDots className="mt-0" />
                </Carousel>
              </div>

              <p
                className={`${lancelot.className} text-red-600 underline text-center text-5xl md:text-6xl lg:text-7xl mt-24 md:mt-36`}
              >
                Recommended Movies
              </p>
              <div className="castcards mt-10">
                <Carousel
                  className="w-full"
                  opts={{
                    slidesToScroll: 1,
                    dots: true,
                    responsive: [
                      {
                        breakpoint: 1024, // lg
                        settings: {
                          slidesToShow: 3,
                          slidesToScroll: 3,
                        },
                      },
                      {
                        breakpoint: 768, // md
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 2,
                        },
                      },
                      {
                        breakpoint: 640, // sm
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                    ],
                  }}
                >
                  <CarouselContent className="mx-5">
                    {movies.map(
                      (movie, index) =>
                        index > 0 && (
                          <CarouselItem
                            className="lg:basis-1/3 md:basis-1/2 sm:basis-full"
                            key={index}
                          >
                            <MovieCard
                              movie={movie}
                              poster={poster[index]}
                              rating={rating[index]}
                              movieClick={() =>
                                router.push(
                                  `/user/recom/${encodeURIComponent(movie)}`
                                )
                              }
                            />
                          </CarouselItem>
                        )
                    )}
                  </CarouselContent>
                  <CarouselDots />
                </Carousel>
              </div>

              {/* Reviews Section */}
              <div className="reviews">
                <p
                  className={`${lancelot.className} text-red-600 underline text-center text-5xl md:text-6xl lg:text-7xl mt-24 md:mt-36`}
                >
                  Reviews
                </p>
                {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.map((reviewData, index) => (
                    <div
                      key={index}
                      className="mt-5 bg-zinc-800 mx-2 md:mx-5 rounded-md p-4 md:p-8"
                    >
                      <p>
                        {expandedReviews[index]
                          ? reviewData
                          : reviewData.slice(0, 500) + "...."}
                      </p>
                      {reviewData.length > 200 && (
                        <Button
                          onClick={() => toggleExpansion(index)}
                          className="bg-transparent"
                        >
                          {expandedReviews[index] ? "Read less" : "Read more"}
                        </Button>
                      )}
                      <p className="mt-6 md:mt-9 text-xl md:text-2xl">
                        Sentiment: {sentiment[index]}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="mt-5 bg-zinc-800 mx-2 md:mx-5 rounded-md p-4 md:p-8">
                    <p>No reviews available.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="footer mt-20 md:mt-40">
              <Footer />
            </div>
          </div>
        )}
    </div>
  );
};

export default Recommend;
