import { useState } from "react";
import { useCloudStorage } from "../../hooks/useCloudStorage";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import styles from "./Upload.module.css";
const Upload = () => {
  const [songFile, setSongFile] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [songName, setSongName] = useState("");
  const [genreType, setGenreType] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const { addFile, response, uploadProgress } = useCloudStorage("songs/");

  const handleFileChange = (event) => {
    setSongFile(event.target.files[0]);
    // console.log(songFile);
  };

  const handleSongUpload = (event) => {
    if (songFile && formIsValid) {
      addFile(songFile, { artistName, songName, genreType });
      //Then wait, then clear the previous file... Possibly redirect to uploaded?
    }
  };
  //TURN THIS INTO A REDUCER
  const handleArtistNameChange = (event) => {
    setArtistName(event.target.value);
    setFormIsValid(event.target.value.length > 0 && songName.length > 0);
  };
  const handleSongNameChange = (event) => {
    setSongName(event.target.value);
    setFormIsValid(event.target.value.length > 0 && artistName.length > 0);
  };
  const handleGenreTypeChange = (event) => {
    setGenreType(event.target.value);
  };
  // const handle

  return (
    <div className={styles["upload"]}>
      <label htmlFor="artist-name">Artist:</label>
      <input
        type="text"
        id="artist-name"
        name="artist-name"
        value={artistName}
        onChange={handleArtistNameChange}
      ></input>

      <label htmlFor="song-name">Song Name:</label>
      <input
        type="text"
        id="song-name"
        name="song-name"
        value={songName}
        onChange={handleSongNameChange}
      ></input>

      <label htmlFor="genre-type">Genre:</label>
      <select
        type="text"
        id="genre-type"
        name="genre-type"
        value={genreType}
        onChange={handleGenreTypeChange}
      >
        <option value="none">None</option>
        <option value="alternative-rock">Alternative Rock</option>
        <option value="ambient">Ambient</option>
        <option value="classical">Classical</option>
        <option value="country">Dance & EDM</option>
        <option value="deep-house">Disco</option>
        <option value="drum-&-bass">Drum & Bass</option>
        <option value="dubstep">Dubstep</option>
        <option value="electronic">Electronic</option>
        <option value="hip-hop-&-rap">Hip-hop & rap</option>
        <option value="house">House</option>
        <option value="indie">Indie</option>
        <option value="jazz-&-blues">Jazz & Blues</option>
        <option value="latin">Latin</option>
        <option value="metal">Metal</option>
        <option value="piano">Piano</option>
        <option value="pop">Pop</option>
        <option value="r-&-b">R&B</option>
        <option value="reggae">Reggae</option>
        <option value="reggaeton">Reggaeton</option>
        <option value="rock">Rock</option>
        <option value="soundtrack">Soundtrack</option>
        <option value="techno">Techno</option>
        <option value="trance">Trance</option>
        <option value="trap">Trap</option>
        <option value="triphop">Triphop</option>
        <option value="world">World</option>
      </select>

      <input type="file" onChange={handleFileChange}></input>

      {!response.isPending && (
        <button onClick={handleSongUpload} disabled={!formIsValid}>
          Upload
        </button>
      )}

      {response.isPending && <button disabled>Uploading... Please wait</button>}
      {/* {response.success && <p> {response.success}</p>} */}
      <LoadingBar progress={uploadProgress} />
      <p>{uploadProgress}</p>
    </div>
  );
};
export default Upload;
