import { useState } from "react";
import { useCloudStorage } from "../../hooks/useCloudStorage";

const Upload = () => {
  const [songFile, setSongFile] = useState(null);
  const { addFile, response, uploadProgress } = useCloudStorage("songs/");
  const handleFileChange = (event) => {
    setSongFile(event.target.files[0]);
    // console.log(songFile);
  };

  const handleSongUpload = (event) => {
    if (songFile) {
      addFile(songFile);
      //Then wait, then clear the previous file... Possibly redirect to uploaded?
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange}></input>
      {!response.isPending && (
        <button onClick={handleSongUpload}>Upload</button>
      )}
      {response.isPending && <button disabled>Uploading... Please wait</button>}
      {response.success && <p> {response.success}</p>}
      <p>{uploadProgress}</p>
    </div>
  );
};
export default Upload;
