import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LandingNav from "../LandingNav/LandingNav";
import styles from "./Detail.module.css";

function Detail() {
  const { id } = useParams();
  const [driver, setDriver] = useState();

  useEffect(() => {
    axios.get(`http://localhost:3001/drivers/${id}`).then(({ data }) => {
      setDriver(data);
    });

    return setDriver();
  }, [id]);

  if (!driver) {
    return <div>no se encontre driver con ese id</div>;
  }

  return (
    <>
      <LandingNav />
      <h1 className={styles.titulo}>Detail Drivers </h1>

      <div className={styles.container}>
        <div className={styles.detailL}>
          <h2>nationality</h2>
          <p>{driver.nacionalidad}</p>
          <h2>B-Day</h2>
          <p>{driver.nacimiento}</p>
          <h2>Teams</h2>
          {driver.teams && <p>{driver.teams.join(",")}</p>}
        </div>
        <div className={styles.detailR}>
          <img className={styles.img} src={driver.imagen} alt={driver.nombre} />
          <h1>
            {driver.nombre} {driver.apellido}
          </h1>
          <p>{driver.descripcion}</p>
        </div>
      </div>
    </>
  );
}
export default Detail;
