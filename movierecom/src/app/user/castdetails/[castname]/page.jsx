"use client";

import Footer from "@/app/helpers/Footer";
import MovieCard from "@/app/helpers/MovieCard";
import Navbar from "@/app/helpers/Navbar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel";
import axios from "axios";
import { Lancelot, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "300"] });
const lancelot = Lancelot({ weight: ["400"], subsets: ["latin-ext"] });

export default function Page({ params }) {
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [pob, setPob] = useState("");
  const [title, setTitle] = useState([]);
  const [movposter, setMovieposter] = useState([]);
  const [actorposter, setActorposter] = useState("");
  const [rating, setRating] = useState([]);
  const [clamp, setClamp] = useState(true);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { castname: selectedcast } = params;

  useEffect(() => {
    if (selectedcast) {
      setLoading(true);
      axios
        .post(
          "http://127.0.0.1:5000/castdetails",
          { castname: decodeURIComponent(selectedcast) },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setBio(response.data["bio"]);
          setName(response.data["name"]);
          setDob(response.data["dob"]);
          setPob(response.data["pob"]);
          setActorposter(response.data["actor_poster"]);
          setTitle(response.data["movies"]);
          setMovieposter(response.data["movie_poster"]);
          setRating(response.data["ratings"]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedcast]);

  return (
    <div>
      <header>
        <Navbar />
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="red" size={70} />
        </div>
      ) : (
        <div>
          <p className={`${lancelot.className} title text-7xl text-center text-white mt-12`}>
            Cast Details
          </p>

          <div className="castdetails flex flex-col items-center text-white">
            <img
              src={actorposter}
              alt=""
              className="h-[500px] mt-12 shadow-xl shadow-white rounded-2xl"
            />
            <div className="dets w-[95%] bg-zinc-800 p-10 rounded-md mt-12">
              <p className={`${poppins.className} name text-4xl mb-5 font-bold`}>
                Name: {name}
              </p>
              <p className={`bio mt-5 text-lg ${clamp ? "line-clamp-3" : "line-clamp-none"}`}>
                {bio}
              </p>
              <Button onClick={() => setClamp(!clamp)}>{clamp ? "Read More" : "Read Less"}</Button>
              <p className="dob mt-5 text-xl">Date of Birth: {dob}</p>
              <p className="pob mt-5 text-xl">Place of Birth: {pob}</p>
            </div>
          </div>

          <div className="movies mt-12">
            <p className={`${lancelot.className} title text-5xl underline text-center text-red-500 mt-40`}>
              Recommended Movies
            </p>

            <div className="mov gap-[200px] mx-5 mt-20">
              <Carousel
                className="w-full"
                opts={{
                  slidesToScroll: 1,
                  dots: true,
                }}
              >
                <CarouselContent className="mx-5">
                  {title.map(
                    (title, index) =>
                      index > 0 && (
                        <CarouselItem className="lg:basis-1/3 sm:basis-1" key={index}>
                          <MovieCard
                            movie={title}
                            poster={movposter[index]}
                            rating={rating[index]}
                            movieClick={() =>
                              router.push(`/user/recom/${encodeURIComponent(title)}`)
                            }
                          />
                        </CarouselItem>
                      )
                  )}
                </CarouselContent>
                <CarouselDots />
              </Carousel>
            </div>
          </div>

          <div className="footer mt-40">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}
