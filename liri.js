// import packages
require('dotenv').config();
const fs = require('fs');
const keys = require('./keys');
const request = require('request');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const { Console } = require('console');

//set keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
 
//customer logger
const output = fs.createWriteStream('./log.txt', {flags: 'a'});
const errorOutput = fs.createWriteStream('./errorLog.txt', {flags: 'a'});
const logger = new Console({ stdout: output, stderr: errorOutput });
const customLog = (d) => {
  logger.log(d);
  console.log(d);
}


//command line arguments
const command = process.argv[2];
const arg1 = process.argv[3];

//command logic
switch (command) {
  case 'my-tweets':
    getTweets();
    break;
    
  case 'spotify-this-song':
    let query = '';
    if(arg1) {
      for(let i = 3; i < process.argv.length; i++) {
        i === 3 ? query += process.argv[i] : query += " " + process.argv[i];
      }
    } else {
      query = "The Sign";
    }
    spotifySearch(query);
    break;
    
  case 'movie-this':
    findMovie();
    break;
    
  case 'do-what-it-says':
    fs.readFile('random.txt', 'utf8', function(error, data) {
      if(!error) {
        spotifySearch(data);
      } else {
        console.log(error)
      }
    });
    break;  

  default:
    break;
}

function spotifySearch(query) {
  spotify.search({ type: 'track', query }, function(error, data) {
    if(!error) {
      const track = query === 'The Sign' ? data.tracks.items[5] : data.tracks.items[0];
      customLog('');
      customLog(track.name);
      customLog(track.artists[0].name);
      customLog(track.album.name);
      customLog(track.external_urls.spotify);
    } else {
      console.log(error);
    }
  });
}

function findMovie() {
  const apikey = 'trilogy';
    let movie = '';
    for(let i = 3; i < process.argv.length; i++) {
      i === 3 ? movie += process.argv[i] : movie += "+" + process.argv[i];
    }
    const url = 'http://www.omdbapi.com/?apikey=' + apikey + '&t=' + movie;
    request(url, function (error, response, body) {
      if(!error && response.statusCode === 200) {
        const movieData = JSON.parse(body);
        customLog('');
        customLog("Title: " + movieData.Title);
        customLog("Released: " + movieData.Released);
        customLog(movieData.Ratings[0].Source + " score: " + movieData.Ratings[0].Value);
        customLog(movieData.Ratings[1].Source + " score: " + movieData.Ratings[0].Value);
        customLog("Country: " + movieData.Country);
        customLog("Language: " + movieData.Language);
        customLog("Plot: " + movieData.Plot);
        customLog("Actors: " + movieData.Actors);
      } else {
        console.log(error);
      }  
    });
}

function getTweets() {
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if(!error) {
      for(let tweet of tweets) {
        customLog('');
        customLog(tweet.text);
        customLog(tweet.created_at);
        customLog(tweet.user.screen_name);
      }
    } else {
      console.log(error);
    }
  });
}