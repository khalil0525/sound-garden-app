import styles from "./Home.module.css";
import ActionBar from "../../components/ActionBar/ActionBar";

export default function Home() {
  return (
    <div className={styles.home}>
      <h2>Home</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae qui
        deserunt expedita quod recusandae porro a quaerat impedit, unde
        doloremque aut culpa praesentium eum suscipit itaque earum rerum nulla?
        Corrupti.ddd
      </p>
      <ActionBar></ActionBar>
    </div>
  );
}