import styles from "./HomeNav.module.css";
import { Link } from "react-router-dom";

import F1 from "../../assets/F1.svg";

function HomeNav({ name, setName }) {
  return (
    <div className={styles.container}>
      <img className={styles.img} src={F1} />
      <input
        className={styles.input}
        type="text"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <Link className={styles.form} to="/form" relative="path">
        Form
      </Link>
    </div>
  );
}

export default HomeNav;
