import React from "react";

import ReactDOM from "react-dom";
import DeleteOverlay from "./DeleteOverlay/DeleteOverlay";
import EditOverlay from "./EditOverlay/EditOverlay";
// import Card from "./Card";
// import Button from "./Button";
import styles from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onCancel} />;
};

const ModalOverlay = (props) => {
  return (
    <>
      {props.action === "delete" && (
        <DeleteOverlay onConfirm={props.onConfirm} onCancel={props.onCancel} />
      )}
      {props.action === "edit" && (
        <EditOverlay
          song={props.song}
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
