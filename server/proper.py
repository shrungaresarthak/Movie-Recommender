import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import requests
import pickle
from bs4 import BeautifulSoup
from flask import request
import os
from datetime import datetime

API_KEY='75d6f4d358afd80023fc135735da8af5'



df = pd.read_csv('server\\TMDB_Final.csv')
main_features = df[['id','title','genres','overview','crew','keywords','cast','vote_average','release_date']]
main_features.isnull().sum()
main_features_copy = main_features.copy()
main_features_copy.dropna(inplace=True)
sentiment = pickle.load(open('server\\nlp.pkl','rb'))
vectorizer = pickle.load(open('server\\transform.pkl','rb'))

main_features_copy['genres']=main_features_copy['genres'].apply(lambda x : x.replace('Science Fiction','Sci-Fi'))
main_features_copy['genres']=main_features_copy['genres'].apply(lambda x:x.replace("'",'').replace(" ",'').strip('[]'))
main_features_copy['cast']=main_features_copy['cast'].apply(lambda x:x.replace("'",'').replace(" ",'').strip('[]'))
main_features_copy['keywords']=main_features_copy['keywords'].apply(lambda x:x.replace("'",'').replace(" ",'').strip('[]'))   
main_features_copy['cast']=main_features_copy['cast'].apply(lambda x:x.strip('[]'))
main_features_copy['genres']=main_features_copy['genres'].apply(lambda x:x.strip('[]'))
main_features_copy['keywords']=main_features_copy['keywords'].apply(lambda x:x.strip('[]'))

main_features_copy['tags']=main_features_copy['overview'] + main_features_copy['genres'] + main_features_copy['keywords'] + main_features_copy['cast'] + main_features_copy['crew']

new_df = main_features_copy[['id','title','tags']]
new_df_copy = new_df.copy()
from nltk import PorterStemmer
ps = PorterStemmer()
def stem(x):
    if pd.notna(x):
        L = []
        for i in x.split():
            L.append(ps.stem(i))
        return " ".join(L)
    else:
        return x 

new_df_copy['tags'] = new_df_copy['tags'].apply(stem)
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(max_features=5000, stop_words='english')

new_df_copy['tags'].fillna('', inplace=True)  
vectors = cv.fit_transform(new_df['tags']).toarray()

similarity = cosine_similarity(vectors)

sorted(list(enumerate(similarity[0])),reverse=True,key = lambda x:x[1])[1:12]

def get_movie_id(movie):
    base_url = 'https://api.themoviedb.org/3/search/movie'
    params = {
        'api_key': API_KEY,
        'query': movie
    }
    response = requests.get(base_url, params=params)
    data = response.json()
    if 'results' in data and data['results']:
        movie_id = data['results'][0]['id']
        return movie_id
    else:
        print(f"No results found for '{movie}'")

def get_movie_details(movie):
    try:
        genre = (df.loc[df['title'] == movie]).to_string(header=False, index=False, columns=['genres']).strip('[]').replace("'", '')
        if not genre.strip():
            genre = "N/A"
    except KeyError:
        genre = "N/A"

    try:
        overview = (df.loc[df['title'] == movie]).to_string(header=False, index=False, columns=['overview']).replace(",", "")
        overview = overview.strip('[]')
        if not overview.strip():
            overview = "N/A"
    except KeyError:
        overview = "N/A"

    try:
        release_date = (df.loc[df['title'] == movie]).to_string(header=False, index=False, columns=['release_date'])
        formatted_date = pd.to_datetime(release_date).strftime('%d %B %Y')
        if pd.isna(formatted_date):
            formatted_date = "N/A"
    except (KeyError, ValueError, pd.errors.OutOfBoundsDatetime):
        formatted_date = "N/A"

    try:
        ratings = (df.loc[df['title'] == movie]).to_string(header=False, index=False, columns=['vote_average'])
        if not ratings.strip():
            ratings = "N/A"
    except KeyError:
        ratings = "N/A"

    return genre, overview, formatted_date, ratings

def get_reviews(movie_id):
    reviews = []
    details_url = f'https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key={API_KEY}'
    details_response = requests.get(details_url)
    details_data = details_response.json()       
    num_reviews = min(6, len(details_data['results']))
    for i in range(num_reviews):
        reviews.append(details_data['results'][i]['content'])
    if len(reviews)==0:
        return []
    
    rev = np.array(reviews)
    n = vectorizer.transform(rev)
    sent = sentiment.predict(n)
    new_sent = sent.tolist()
        
    for i in range(len(new_sent)):
        if new_sent[i] == 0:
            new_sent[i] = 'Negative'
        else:
            new_sent[i] = 'Positive'
                
    return reviews, new_sent
    
    
def fetch_poster(movie_id):
    response= requests.get('https://api.themoviedb.org/3/movie/{}?api_key={}'.format(movie_id,API_KEY))
    data = response.json()
    try:
        path = 'https://image.tmdb.org/t/p/w500'+data['poster_path']
        return path
    except:
        return 'https://img.pikbest.com/backgrounds/20200428/film-and-television-festival-retro-film-poster_2824252.jpg!f305cw'

def get_castcrew(movie_id):
    response = requests.get('http://api.themoviedb.org/3/movie/{}?api_key={}&append_to_response=credits&language=en-US'.format(movie_id,API_KEY))
    data = response.json()
    dets =  data['credits']['cast'][0:10]
    ids = [i['id'] for i in dets]
    details= []
    character = [i['character'] for i in dets]
    poster = [i['profile_path'] for i in dets]
    for i in ids:
        response2 = requests.get('https://api.themoviedb.org/3/person/{}?api_key={}'.format(i,API_KEY))
        data2 = response2.json()
        details.append(data2)
    name = [i['name'] for i in details]
    posters =[]
    for i in poster:
        if i:
            posters.append("https://image.tmdb.org/t/p/original"+i)
        else:
            posters.append('https://cdn.create.vista.com/api/media/small/377784052/stock-vector-hand-drawn-modern-man-avatar-profile-icon-portrait-icon-user')
    dets = {"name":name,"poster":posters,"character":character}
    return dets



def get_trailer(movie_id):
    response = requests.get('http://api.themoviedb.org/3/movie/{}?api_key={}&append_to_response=videos'.format(movie_id,API_KEY))
    data = response.json()
    try:
        key = data['videos']['results']
        return key
    except:
        return 'https://images.wondershare.com/recoverit/article/2020/03/Video_unavailable_Img_1.jpg'

def recommend(movie):
    movie_index = df.loc[df['title']==movie].index[0]
    distances = similarity[movie_index]
    movie_list = sorted(list(enumerate(distances)),reverse=True,key = lambda x:x[1])[1:15]
    titles= [movie]
    ip_id = (df.loc[df['title']==movie]).to_string(header=False,index=False,columns=['id'])
    posters =[fetch_poster(ip_id)]
    trailer  = get_trailer(ip_id)
    details = get_movie_details(movie) 
    creds = get_castcrew(ip_id)
    reviews = get_reviews(ip_id)
    ratings= [get_movie_details(movie)[3]]
    for i in movie_list:
        title = new_df.iloc[i[0]].title
        movie_id = new_df.iloc[i[0]].id
        titles.append(title)
        posters.append(fetch_poster(movie_id)) 
        ratings.append(get_movie_details(title)[3])
    print(titles,posters,details,trailer,creds,reviews,ratings)
    return titles,posters,details,trailer,creds,reviews,ratings 


import re
def cast_details(cast):
    response = requests.get('https://api.themoviedb.org/3/search/person?api_key={}&query={}'.format(API_KEY,cast))
    data = response.json()
    cast_id = data['results'][0]['id']
    response2 = requests.get('https://api.themoviedb.org/3/person/{}?api_key={}'.format(cast_id,API_KEY))
    data2 = response2.json()
    name = data2['name']
    bio = data2['biography']
    pob = data2['place_of_birth']
    poster ='https://image.tmdb.org/t/p/original'+data2['profile_path']
    dob = pd.to_datetime(data2['birthday']).strftime('%d %B %Y') 
    
    movies_with_actor = main_features[main_features['cast'].apply(lambda x: cast in x)]
    movies=movies_with_actor['title']
    movie_names = [re.sub(r'^\d+\s+', '', movie) for movie in movies]
    posters=[]
    ratings=[]
    for movie in movie_names:
        ip_id = (new_df.loc[new_df['title']==movie]).to_string(header=False,index=False,columns=['id'])
        posters.append(fetch_poster(ip_id))
        ratings.append(get_movie_details(movie)[3])
    detailjson ={"name":name,"actor_poster":poster,"bio":bio,"pob":pob,"dob":dob,"movies":movie_names,"movie_poster":posters,"ratings":ratings}
    return detailjson

