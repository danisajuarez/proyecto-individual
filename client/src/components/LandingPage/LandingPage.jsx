import { useState } from "react";
import LandingNav from "../LandingNav/LandingNav";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <>
      <LandingNav />

      <div className={styles.contenedor}>
        <div className={styles.texto}>
          <h1 className={styles.welcome}> Welcome. </h1>
          <p className={styles.paraffo}>
            Descubre la emoción de la Fórmula 1, donde la velocidad y la
            competencia se encuentran en cada curva. ¡Bienvenido al apasionante
            mundo de la máxima categoría del automovilismo deportivo!
          </p>
        </div>
        <div className={styles.contenedorImg}>
          <img
            className={styles.imagen}
            src="/autito.jpg"
            alt="Auto de Formula uno color negro"
          />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
