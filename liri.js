require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");

// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var axios = require("axios");
var colors = require("colors");

// Store all of the arguments in an array
var nodeArgs = process.argv;
var command = nodeArgs[2];

// Create an empty variable for holding the movie name
var searchTerm = "";
var text = "";

//Initialising search
search();

//This is the function that recognises the command options and search term.
function search() {
  // Loop through all the words in the node argument
  // And do a little for-loop magic to handle the inclusion of "+"s
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      searchTerm = searchTerm + "+" + nodeArgs[i];
    } else {
      searchTerm += nodeArgs[i];
    }
  }

  switch (command) {
    case "movie-this":
      movieThis();
      break;

    case "concert-this":
      concertThis();
      break;

    case "spotify-this-song":
      spotifyThis();
      break;

    case "do-what-it-says":
      doThis();
      break;
  }
}
//-- END of search() function --

function movieThis() {
  // Setting default value in the event of no search term defined
  if (!searchTerm) {
    searchTerm = "Mr.Nobody";
  }

  //Constructing the query URL for use in axios
  var queryUrl =
    "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  // Then run a request with axios to the OMDB API with the movie specified
  axios
    .get(queryUrl)
    .then(function(response) {
      var reply = response.data;
      console.log("Title: " + reply.Title.green);
      console.log("Release Year: " + reply.Year.green);
      console.log("IMDB Rating: " + reply.imdbRating.green);
      console.log("Rotten Tomatoes Rating: " + reply.Ratings[1].Value.green);
      console.log("Country produced :" + reply.Country.green);
      console.log("Language: " + reply.Language.green);
      console.log("Plot: " + reply.Plot.green);
      console.log("Actors: " + reply.Actors.green);
      text = `------------Movie Request------------\r Title: ${reply.Title}\r Release Year: ${reply.Year}\r IMDB Rating: ${reply.imdbRating}\r Rotten Tomatoes Rating: ${reply.Ratings[1].Value}\r Country produced: ${reply.Country}\r Language: ${reply.Language}\r Plot: ${reply.Plot}\r Actors: ${reply.Actors}\n\r`;
      log();
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
//-- END of movieThis() function --

function concertThis() {
  console.log("Searching for Concerts!");
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    searchTerm +
    "/events?app_id=codingbootcamp";
  console.log(queryUrl);
  axios
    .get(queryUrl)
    .then(function(response) {
      var reply = response.data;
      var concertdate = moment(reply[0].datetime).format("MM/DD/YYYY");
      console.log("Artist: " + reply[0].lineup[0].cyan);
      console.log("Venue: " + reply[0].venue.name.cyan);
      console.log(
        "Location: " +
          reply[0].venue.city.cyan +
          ", " +
          reply[0].venue.country.cyan
      );
      console.log("Date: " + concertdate.cyan);
      text = `------------Concert Request------------\r Artist: ${reply[0].lineup}\r Venue: ${reply[0].venue.name}\r Location: ${reply[0].venue.city}, ${reply[0].venue.country}\r Date: ${concertdate}\n\r`;
      log();
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
//-- END of concertThis() function --

function spotifyThis() {
  console.log("Searching for Song!");

  // Setting default value in the event of no search term defined
  if (!searchTerm) {
    searchTerm = "The Sign (Ace of Base)";
  }

  spotify.search({ type: "track", query: searchTerm, limit: 1 }, function(
    err,
    response
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(
      "Artist: " + response.tracks.items[0].album.artists[0].name.yellow
    );
    console.log("Song Title: " + response.tracks.items[0].name.yellow);
    console.log(
      "Song Link: " +
        response.tracks.items[0].album.external_urls.spotify.yellow
    );
    console.log("Album: " + response.tracks.items[0].album.name.yellow);
    text = `------------Song Request------------\r Artist: ${response.tracks.items[0].album.artists[0].name}\r Song Title: ${response.tracks.items[0].name}\r Song Link: ${response.tracks.items[0].album.external_urls.spotify}\r Album: ${response.tracks.items[0].album.name}\n\r`;
    log();
  });
}
//-- END of spotifyThis() function --

//reads random.txt file and carries out the command and search term within
function doThis() {
  console.log("Doing something!");
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    var searchTermArr = dataArr[1].split(" ");
    console.log(dataArr);
    command = dataArr[0];
    for (var i = 0; i < searchTermArr.length; i++) {
      if (i > 0 && i < searchTermArr.length) {
        searchTerm = searchTerm + "+" + searchTermArr[i];
      } else {
        searchTerm += searchTermArr[i];
      }
    }
    search();
  });
}

function log() {
  fs.appendFile("log.txt", text, function(err) {
    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }

    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      console.log("Content Added!");
    }
  });
}
//-- END of doThis() function --
