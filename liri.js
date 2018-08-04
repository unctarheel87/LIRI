// import packages
require('dotenv').config();
require('colors');
const keys = require('./keys');
const request = require('request');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

//set keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//command line arguments
const command = process.argv[2];
const arg1 = process.argv[3];

//command logic
switch (command) {
  case 'my-tweets':
    client.get('statuses/home_timeline', function(error, tweets, response) {
      if(!error) {
        for(let tweet of tweets) {
          console.log(tweet.text);
          console.log(tweet.created_at);
          console.log(tweet.user.screen_name);
        }
      } else {
        console.log(error);
      }
    });
    break;
    
  case 'spotify-this-song':
    const query = arg1 ? arg1 : "All the Small Things"
    spotify.search({ type: 'track', query }, function(error, data) {
      if(!error) {
        const firstTrack = data.tracks.items[0];
        const track = firstTrack.name;
        const artist = firstTrack.artists[0].name;
        console.log(track);
        console.log(artist);
      } else {
        console.log(error);
      }
    });
    break;
    
  case 'movie-this':
    const apikey = 'trilogy';
    let movie = '';
    for(let i = 3; i < process.argv.length; i++) {
      i === 3 ? movie = movie + process.argv[i] : movie = movie + "+" + process.argv[i];
    }
    const url = 'http://www.omdbapi.com/?apikey=' + apikey + '&t=' + movie;
    console.log(url)
    request(url, function (error, response, body) {
      if(!error && response.statusCode === 200) {
        const movieData = JSON.parse(body);
        console.log("Title: ".green + movieData.Title);
        console.log("Released: ".green + movieData.Released);
        console.log(movieData.Ratings[0].Source.green + " score: ".yellow + movieData.Ratings[0].Value);
        console.log(movieData.Ratings[1].Source.green + " score: ".yellow + movieData.Ratings[0].Value);
        console.log("Country: ".green + movieData.Country);
        console.log("Language: ".green + movieData.Language);
        console.log("Plot: ".green + movieData.Plot);
        console.log("Actors: ".green + movieData.Actors);
      } else {
        console.log(error);
      }  
    });
    break;
    
  case 'do-what-it-says':
    
    break;  

  default:
    break;
}
