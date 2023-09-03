import axios from "axios";
import React, { useState, useEffect} from "react";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList ({numJokesToGet = 5}){

  let [jokes, setJokes] = useState([]);
  let [loading, setLoading] = useState(true);

  /* retrieve jokes from API */
useEffect(function (){
  async function getJokes() {
    let j = [...jokes];
      let seenJokes = new Set();
      try {
      // load jokes one at a time, adding not-yet-seen jokes

      while (j.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      setJokes(j);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  if (jokes.length === 0) getJokes();
  }, [jokes, numJokesToGet]);

  function genNewJokes(){
    setJokes([]);
    setLoading(true)
  }

  function vote(id, change){
    setJokes(totalJokes =>
      totalJokes.map(j => 
        (j.id === id ? {...j, votes: j.votes + change} : j)))
  }

  if(loading){
    return(
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  /* render: either loading spinner or list of sorted jokes. */


    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={genNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(({joke, id, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
 }


export default JokeList;
