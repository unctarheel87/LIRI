require('dotenv').config();
const keys = require('./keys');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

const command = process.argv[2];
const arg1 = process.argv[3];

switch (command) {
  case 'my-tweets':
    client.get('statuses/home_timeline', function(error, tweets, response) {
      if(!error){
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
    const query = "All the Small Things"
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
    
    break;
    
  case 'do-what-it-says':
    
    break;  

  default:
    break;
}
