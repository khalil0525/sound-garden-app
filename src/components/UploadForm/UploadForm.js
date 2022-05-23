import { Formik, Form, Field, ErrorMessage } from "formik";
const UploadForm = (props) => {
  return (
    <>
      <div>
        <h1>Any place in your app!</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {/* <div className={styles["photo-picker"]}>
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
          <button onClick={handleSongUpload} disabled={!uploadIsReady}>
            Upload
          </button>
        </div>
      )} */}
    </>
  );
};
export default UploadForm;
