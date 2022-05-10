


const UploadForm = (props) => {

  return ( 
              <>
                <div className={styles["photo-picker"]}>
                  <img
                    className={styles["photo-picker-photo"]}
                    src={songPhotoFile ? songPhotoURL : placeholderImage}
                    alt="Song Cover Art"
                    width="160"
                    height="160"
                  />
                  <input
                    type="file"
                    onChange={handleSongPhotoFileChange}
                    disabled={cloudStorageResponse.isPending}
                    accept="image/*"
                  />
                </div>

                <label htmlFor="artist-name">Artist:</label>
                <input
                  type="text"
                  id="artist-name"
                  name="artist-name"
                  value={artistName}
                  onChange={handleArtistNameChange}
                  disabled={cloudStorageResponse.isPending}
                ></input>

                <label htmlFor="song-name">Song Name:</label>
                <input
                  type="text"
                  id="song-name"
                  name="song-name"
                  value={songName}
                  onChange={handleSongNameChange}
                  disabled={cloudStorageResponse.isPending}
                ></input>

                <GenreSelect
                  onGenreTypeChange={handleGenreTypeChange}
                  genreValue={genreType}
                  disabled={cloudStorageResponse.isPending}
                />

                {!cloudStorageResponse.isPending && (
                  <div className={styles["action-container"]}>
                    <div onClick={handleCancelClick}>Cancel</div>
                    <button
                      onClick={handleSongUpload}
                      disabled={!uploadIsReady}
                    >
                      Upload
                    </button>
                  </div>
                )}
              </>
            
           

     
};
export default UploadForm;
