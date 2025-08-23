import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [chances, setChances] = useState(6);
  const [word, setWord] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(["movies"])

  function GetNewWord(){
      setLoading(true)
      let result = []
      const fetchnewword =  async () => {
        for(const option of selected){
          const response =  await fetch(
            `/content/${option}.json`
          );
          result.push( await response.json());   
        };
        const chosenOption = result[Math.floor(Math.random() * (result.length))]
        setWord(chosenOption[Math.floor(Math.random() * (chosenOption.length))]);
        setChances(6);
        setLoading(false)
      };
      fetchnewword();
  }
  
  useEffect(()=>
  {if(selected.length>0) GetNewWord(); else setWord(null)},[selected])

  return (
    <div className="App">
      <img
        src={require(`../public/images/Hangman-${chances}.png`)}
        alt="hangman.png"
      />
      <div><strong>{chances}</strong> chances remaining</div>
      {loading?<div>Loading...</div> : chances > 0 && word? (
        <div><Wordspace key={word} word={word} setChances={setChances} chances={chances} /><button onClick={GetNewWord}>New Game</button></div>
      ) : (
        <div>
          Game Over <br />
          The right guess was <strong>{word}</strong> <br />
          <button
            onClick={GetNewWord}
          >
            Try again?
          </button>
        </div>
      )}
        <Options selected={selected} setSelected={setSelected}/>
    </div>
  );
}

function Wordspace({ word, setChances, chances }) {
  const toguess = word.split("");
  const [currentChar, setCurrentChar] = useState("");
  const [currentWord, setCurrentWord] = useState(() => 
    toguess.map((char) => 
      ['a','e','i','o','u',' ',':','-','.','\"','\'','!',','].includes(char.toLowerCase()) ? char : '_'
    )
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (currentChar === "" || currentChar === " ") return;
    if (word.toLowerCase().includes(currentChar)) {
      let newCurrentWord = [...currentWord];
      for (let i = 0; i < toguess.length; i++) {
        if (toguess[i].toLowerCase() === currentChar.toLowerCase()) {
          newCurrentWord[i] = toguess[i];
        }
      }
      setCurrentWord(newCurrentWord);
    } else setChances(chances - 1);
    setCurrentChar("");
  }
  return (
    <>
      <h3>{currentWord.map((char, index) => {
        return <span key={index}>{char===' '?'\u00A0\u00A0':char} </span>;
      })}</h3>

      {word!==currentWord.join('') ? <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="charInput">Guess a single letter : </label>
        <input
          type="text"
          maxLength="1"
          id="charInput"
          onChange={(e) => setCurrentChar(e.target.value)}
          value={currentChar.toLowerCase()}
        />
        <button type="submit">Try</button>
      </form>:<div>You guessed it right!</div>}
    </>
  );
}

function Options({selected, setSelected}){
  const [error, setError] = useState(false)

  let newSelected = [...selected]
  function handleChange(e){
    if(e.target.checked){
      newSelected.push(e.target.value);
      setError(false);
    }
    else newSelected = newSelected.filter(item => item !== e.target.value);
    if(newSelected.length === 0) return setError(true);
    setSelected(newSelected);
  }
  return <>
    <form>
      <label htmlFor="movies">Movies</label>
      <input type="checkbox" id="movies" value="movies" checked={selected.includes('movies')} onChange={(e) => handleChange(e)} />
      
      <label htmlFor="tv-shows">TV Shows</label>
      <input type="checkbox" id="tv-shows" value="tv-shows" checked={selected.includes('tv-shows')} onChange={(e) => handleChange(e)} />
      
      <label htmlFor="songs">Songs</label>
      <input type="checkbox" id="songs" value="songs" checked={selected.includes('songs')} onChange={(e) => handleChange(e)} />
      
      <label htmlFor="artists">Artists</label>
      <input type="checkbox" id="artists" value="artists" checked={selected.includes('artists')} onChange={(e) => handleChange(e)} />
      
      <label htmlFor="video-games">Video Games</label>
      <input type="checkbox" id="video-games" value="video-games" checked={selected.includes('video-games')} onChange={(e) => handleChange(e)} />
      
      <label htmlFor="books">Books</label>
      <input type="checkbox" id="books" value="books" checked={selected.includes('books')} onChange={(e) => handleChange(e)} />
    
      <label htmlFor="bollywood">Bollywood</label>
      <input type="checkbox" id="bollywood" value="bollywood" checked={selected.includes('bollywood')} onChange={(e) => handleChange(e)} />
    </form>
  {error && "You need to have atleast one category selected!"}
  </>
}

export default App;
