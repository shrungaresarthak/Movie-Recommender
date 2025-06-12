from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import Flask, jsonify, request
import warnings
from pymongo import MongoClient
import secrets
from datetime import timedelta
import random
from proper import *
import logging
warnings.filterwarnings('ignore',category=pd.errors.SettingWithCopyWarning)
app = Flask(__name__)
bcrypt = Bcrypt(app)


CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.config['JWT_SECRET_KEY'] = 'Scout2546'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)


client = MongoClient('mongodb://localhost:27017')
db = client['MovieDB']

def generate_secure_token(length=32):
    return secrets.token_hex(length)


df = pd.read_csv('server\\TMDB_Final.csv')

@app.route('/user',methods=['GET'])
def user():
    email  = request.args.get('username')
    titles=[]
    watchlist_movies_json = db['Users'].find_one({"email":email},{"movies":4})
    if watchlist_movies_json:
        movies = watchlist_movies_json.get('movies',[])
        for i in range(len(movies)):
            titles.append(movies[i]['title'])
        final_movies = recommend(random.choice(titles))
        return jsonify({"movie_titles":final_movies[0],"movies_poster":final_movies[1],"movie_ratings":final_movies[-1]})  
    else:
        return jsonify({"message":"No movies in watchlist"})

   
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        body = request.json
        name = body.get('name')
        email = body.get('email')
        password = body.get('password', None)  
        provider = body.get('provider', 'credentials')  # Default to credentials

        # Check if the user already exists in the database
        if not db['Users'].find_one({"email": email}):
            if provider == 'credentials':
                if not password:
                    return jsonify({'message': 'Password is required for credentials signup', 'success': False}), 400
                
                pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
            elif provider in ['google','github']:
                pw_hash = None
            
            # Insert user into the database
            db['Users'].insert_one({
                "name": name,
                "email": email,
                "password": pw_hash,  
                "provider": provider,  
                "image": body.get('image')  
            })
            return jsonify({'success': True}), 200
        else: 
            return jsonify({
                'message': 'An account already exists with this email, try logging in.',
                'success': False
            }), 400

    if request.method == 'GET':
        user_email = request.args.get('user_email')
        all_data = db['Users'].find_one({"email":user_email})
        if not all_data:
            return jsonify({'message':'User does not exist','user':None}),200
        data_json = {"id": str(all_data['_id']), "name": all_data['name'], "email": all_data['email'], "provider": all_data['provider'],"image":all_data['image']}
        print(data_json)
        return jsonify({"user":data_json})

@app.route('/autocomplete', methods=['GET'])
def autocom():
    query = request.args.get('query', '')
    movies = df['title'].tolist()
    
    if query:
        movies = [movie for movie in movies if query.lower() in movie.lower()]
    
    return jsonify({'movies': movies[:13]})


@app.route('/login', methods=['POST'])
def login():
    try:
        body = request.json
        email = body.get('email')
        password = body.get('password', None)
        provider = body.get('provider')
        if provider == 'credentials':
            if not email or not password:
                return jsonify({'message': 'Invalid request. Please provide both email and password.'}), 400

            user = db['Users'].find_one({"email": email})
            if user['provider'] == 'google' or user['provider'] == 'github':
                return jsonify({'message':'Account already exists via provider. Login via Provider'}),400
        
            
            if user and bcrypt.check_password_hash(user['password'], password):
                logging.info(f'User {email} logged in successfully via credentials')
                response = make_response(jsonify({'email': email, 'is_Auth': True}))
                return response, 200
            else:
                logging.warning(f'Failed login attempt for {email}')
                return jsonify({'message': 'Invalid email or password'}), 401

        elif provider and provider != 'credentials':
            user = db['Users'].find_one({"email": email})
            print(user)
            if user:
                if user['provider']=='credentials':
                    logging.warning(f'Failed login attempt for {email} via {provider}')
                    return jsonify({'message': 'User has credentials'}), 404
                else:
                    logging.info(f'User {email} logged in successfully via {provider}')
                    return jsonify({'message': 'Logged in successfully', 'provider': provider}), 200

        else:
            return jsonify({'message': 'Invalid provider'}), 400

    except Exception as e:
        logging.error(f"Login failed due to an error: {str(e)}")
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

@app.route("/watchlist", methods=["GET","POST","DELETE"])
def save_movie():
   
   if request.method=='POST':
        data = request.json
        username = data.get("username")
        title = data.get("title")
        poster = data.get("poster")
        movie_id = get_movie_id(title)
        print(username)
        if username and title and poster:
            user = db['Users'].find_one({"email": username})

            if any(movie['id'] == movie_id for movie in user.get('movies', [])):
                return jsonify({"message": "Movie already in watchlist"}), 400
            
            if user and title and poster:
                db['Users'].update_one(
                {"email": username},
                {"$push": {"movies": {"id":movie_id,"title": title, "poster": poster,"saved":True}}},
                    )
           

            return jsonify({"message": "Movie saved successfully","data":[username,title,poster]}), 200
        else:
            return jsonify({"error": "Missing data"}), 400

    
   if request.method=='GET':
       username = request.args.get('username')
       if username:
            user = db['Users'].find_one({"email": username}, {"_id": 0, "movies": 4})

            if user:
                movies = user.get('movies', [])      
                if len(movies)==0 or not movies:               
                    print('No movies found') 
                    return jsonify({"message":"There are no movies in your watchlist. Start adding them and have your own personalized watchlist."}),404
                else:
                    return jsonify({"movies":movies})
            else:
                print('No')
                return jsonify({'message':"There are no movies in your watchlist. Start adding them and have your own personalized watchlist."}),404      
       else:
            return jsonify({"error": "Username not provided"}),401

   if request.method=='DELETE':
       
       username=request.args.get('username')
       titlemov = request.args.get('title')
       poster = request.args.get('poster') 
       print(username,titlemov,poster) 
       if username:
            user = db['Users'].find_one({"email": username}, {"_id": 0, "movies": 4})

            if user:
                movies = user.get('movies', [])
                filtered_movies = [movie for movie in movies if movie['id'] != get_movie_id(titlemov)]  # Filter movies
                print(filtered_movies)
                if filtered_movies!= movies:
                    db['Users'].update_one(
                        {'email':username},
                        {'$set':{"movies":filtered_movies}}
                    )
                  
                return jsonify({"message": "Movie removed successfully","data":filtered_movies}), 200

            
       else:
            return jsonify({"error": "Username not provided"}),400
       

@app.route('/recom', methods=['POST'])
def recom():
       try:
            data = request.json
            if 'movie_name' in data:  
                movie_name = data['movie_name']
                movies = recommend(movie_name)
                print(movies)
                return jsonify(movies)
            else:
                return jsonify({'error': 'Invalid request. Please provide a valid movie name.'}), 400
        
       except Exception as e:
           return jsonify({'error':'Oops! An error occured with the server. Try restarting'}),404
    
@app.route('/castdetails', methods=['GET', 'POST'])
def show():
    if request.content_type != 'application/json':
        return jsonify({'error': 'Invalid content type'}), 400
    


    if request.method=='POST':
        data=request.json
        if 'castname' in data:
            cast_name = data['castname']
            details = cast_details(cast_name)
            print(details)
            return jsonify(details)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
