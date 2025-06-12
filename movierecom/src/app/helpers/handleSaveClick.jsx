import axios from 'axios';
export default async function  handleSaveClick({movieName,movie_poster}) {
        const username = localStorage.getItem('email') 
        localStorage.setItem('Saved','false')
        console.log(username)
        
        try {
          await axios.post('http://localhost:5000/watchlist', {
          username: username,
          title: movieName,
          poster: movie_poster,
        }).then((response)=>{
          console.log(response.data);
          
        })
       
        
         
        } catch (error) {
          console.error('Error saving movie', error);
        }
      };

