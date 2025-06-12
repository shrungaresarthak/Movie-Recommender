"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Inter, Lancelot, Poppins } from "next/font/google";
import Footer from "./helpers/Footer";
import Navbar from "./helpers/Navbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "300"] });
const inter = Inter({ subsets: ["latin"] });
const lancelot = Lancelot({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const{data:session} = useSession()
    
  if(session){
    redirect('/user/recom')
  }
  const features = [
    {
      featureTitle: "Personalized Recommendations",
      featureDesc: "Get recommendations according to your taste and enjoy.",
    },
    {
      featureTitle: "Sentiment Analysis",
      featureDesc:
        "Sentiment Analysis which determines which review is positive and which is negative.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen  text-white">
                  <Navbar/>

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
              Get personalized movie recommendations and have an amazing
              experience.
            </p>
            <div className="mt-6 sm:mt-10">
              <Link href="/login">
                <Button
                  variant="destructive"
                  className="mx-2 w-[25%]  h-10 sm:h-12"
                >
                  Get Started
                </Button>
              </Link>
             <Link href={'/about-us'}>
            
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black opacity-50"></div>
      </div>

      <div className="flex-grow mt-16 sm:mt-24">
        <p
          className={` ${lancelot.className} font-bold text-red-500 text-5xl sm:text-6xl lg:text-7xl underline text-center`}
        >
          Our Features
        </p>
        <div className="mt-12 sm:mt-16 lg:mt-28 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 px-6 lg:px-24">
          {features.map((ft, i) => (
            <Card
              key={i}
              className="bg-zinc-800 border-none shadow-md shadow-zinc-500 w-full sm:w-[90%] lg:w-[70%] h-[400px] sm:h-[450px] mx-auto"
            >
              <CardHeader className="p-0">
                <img
                  src="https://repository-images.githubusercontent.com/275336521/20d38e00-6634-11eb-9d1f-6a5232d0f84f"
                  className="rounded-t-xl w-full h-[200px] object-cover"
                  alt=""
                />
                <CardTitle
                  className={` ${poppins.className} ml-5 text-white text-lg sm:text-xl pt-5`}
                >
                  {ft.featureTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white p-5">
                <p>{ft.featureDesc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <section className="max-w-6xl mx-auto my-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              At MovieDB, our mission is to help you discover and enjoy the best movies out there. We believe that everyone should have access to quality movie recommendations tailored to their preferences. From blockbusters to indie films, we bring you curated lists and reviews that cater to all tastes.
            </p>
          </div>
          <img
            src="https://destinyinfra.in/wp-content/uploads/2021/08/our_vision.jpg" 
            alt="Our Mission" 
            width={600} 
            height={400} 
            className="rounded-lg "
          />
        </div>
      </section>

     

      <section className="max-w-6xl mx-auto my-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="feature text-center p-6 bg-zinc-800 rounded-lg ">
            <h3 className="text-2xl font-semibold mb-4">Personalized Recommendations</h3>
            <p>
              Get movie suggestions based on your viewing history and preferences.
            </p>
          </div>
          <div className="feature text-center p-6 bg-zinc-800 rounded-lg ">
            <h3 className="text-2xl font-semibold mb-4">In-depth Reviews</h3>
            <p>
              Read reviews and ratings from our community and expert critics.
            </p>
          </div>
        
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-6xl mx-auto my-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Our Community</h2>
        <p className="text-lg md:text-xl mb-8">
          Become a part of the MovieDB family and never miss out on a great film again!
        </p>
       <Link href={'/login'} >
       <button className="bg-red-600 text-white py-3 px-8 rounded-lg  hover:bg-red-700 transition duration-300">
          Get Started
        </button>
       </Link>
      </section>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
