import React from "react";

import ReactDOM from "react-dom";
import DeleteSongOverlay from "./DeleteSongOverlay/DeleteSongOverlay";
import EditSongOverlay from "./EditSongOverlay/EditSongOverlay";
import EditProfileOverlay from "./EditProfileOverlay/EditProfileOverlay";
// import Card from "./Card";
// import Button from "./Button";
import styles from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onCancel} />;
};

const ModalOverlay = (props) => {
  return (
    <>
      {props.action === "deleteSong" && (
        <DeleteSongOverlay
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
        />
      )}
      {props.action === "editSongInformation" && (
        <EditSongOverlay
          song={props.song}
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
        />
      )}
      {props.action === "editProfileInformation" && (
        <EditProfileOverlay
          userInformation={props.userInformation}
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
        />
      )}
    </>

    // <Card className={styles.modal}>
    //   <header className={styles.header}>
    //     <h2>{props.title}</h2>
    //   </header>
    //   <div className={styles.content}>
    //     <p>{props.message}</p>
    //   </div>
    //   <footer className={styles.actions}>
    //     <Button onClick={props.onConfirm}>Okay</Button>
    //   </footer>
    // </Card>
  );
};
const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onCancel={props.onCancel} />,
        document.getElementById("backdrop-root")
      )}

      {ReactDOM.createPortal(
        <ModalOverlay
          // title={props.title}
          // message={props.message}
          userInformation={props.userInformation}
          song={props.song}
          action={props.action}
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
        />,
        document.getElementById("overlay-root")
      )}
    </>
  );
};

export default Modal;
