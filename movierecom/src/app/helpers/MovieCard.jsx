import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Inter, Poppins } from 'next/font/google';
import React from 'react'

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"] ,weight:['500']});


export default function MovieCard({ poster, movie,rating, movieClick }) {
  return (
    <div className="flex justify-center p-4 scale-100 ">
      <Card className='w-2/3 sm:max-w-sm md:max-w-md lg:max-w-1/4  rounded-lg border-none cursor-pointer ' onClick={movieClick}>
        <CardHeader className=''>
          <img
            src={poster}
            className="w-full h-auto relative brightness-75 rounded-lg shadow-xl shadow-white/50"
            alt="Poster"
          />
        </CardHeader>
       <div className="absolute top-5 p-1 flex items-center">
       <StarFilledIcon color='yellow' className='w-7 h-7'/>
       <p className='text-white text-3xl top-4'>{rating}</p>
       </div>

        <CardTitle
          className={` ${poppins.className} text-white text-2xl font-bold pt-4`}
        >
          {movie}
        </CardTitle>
      
      </Card>
    </div>
  )
}
