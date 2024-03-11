import { useState } from "react";
import { Link } from "react-router-dom";
import F1 from "../../assets/F1.svg";
import styles from "./LandingNav.module.css";
function Nav() {
  return (
    <div className={styles.container}>
      <img className={styles.img} src={F1} />

      <Link className={styles.homePage} to="/home" relative="path">
        Home Page
      </Link>
    </div>
  );
}

export default Nav;
