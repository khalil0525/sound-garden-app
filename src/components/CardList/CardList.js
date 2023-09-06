import styles from "./CardList.module.css";
import ListCard from "./ListCard";
import { Link } from "react-router-dom";
const CardList = ({ list, page, className }) => {
  return (
    <div className={`${styles.cardlist} ${className}`}>
      <ul className={styles["cardlist__list"]}>
        {list &&
          list.map((item) => (
            <Link
              to={`/${page}/${item.title}`}
              state={{
                from: page.substring(0, page.length - 1),
                search: item.title,
              }}
              key={item.title}>
              <ListCard
                title={item.title}
                content={item.content}
                background={item.background}
              />
            </Link>
          ))}
      </ul>
    </div>
  );
};
export default CardList;
