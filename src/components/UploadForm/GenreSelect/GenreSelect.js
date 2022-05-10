import React from "react";

const GenreSelect = ({ onGenreTypeChange, genreValue, disabled }) => {
  return (
    <>
      <label htmlFor="genre-type">Genre:</label>
      <select
        type="text"
        id="genre-type"
        name="genre-type"
        value={genreValue}
        onChange={onGenreTypeChange}
        disabled={disabled}
      >
        <option value="none">None</option>
        <option value="alternative rock">Alternative Rock</option>
        <option value="ambient">Ambient</option>
        <option value="classical">Classical</option>
        <option value="country">Country</option>
        <option value="dance & edm">Dance & EDM</option>
        <option value="dancehall">Dancehall</option>
        <option value="deep house">Deep House</option>
        <option value="disco">Disco</option>
        <option value="drum & bass">Drum & Bass</option>
        <option value="dubstep">Dubstep</option>
        <option value="electronic">Electronic</option>
        <option value="hip-hop & rap">Hip-hop & rap</option>
        <option value="house">House</option>
        <option value="indie">Indie</option>
        <option value="jazz & blues">Jazz & Blues</option>
        <option value="latin">Latin</option>
        <option value="metal">Metal</option>
        <option value="piano">Piano</option>
        <option value="pop">Pop</option>
        <option value="r&b">R&B</option>
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
    </>
  );
};

export default GenreSelect;
