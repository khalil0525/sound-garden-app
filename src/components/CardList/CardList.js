import styles from "./CardList.module.css";
import Card from "./Card";
import { Link } from "react-router-dom";
const CardList = (props) => {
  return (
    <div className={`${styles.cardlist} ${props.className}`}>
      <ul className={styles["cardlist__list"]}>
        {props.list &&
          props.list.map((item) => (
            <Link
              to={`/${props.page}/${item}`}
              state={{
                from: props.page.substring(0, props.page.length - 1),
                search: item,
              }}
              key={item}
            >
              <Card title={item} />
            </Link>
          ))}
      </ul>
    </div>
  );
};
export default CardList;
