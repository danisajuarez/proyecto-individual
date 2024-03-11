import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./DriverList.module.css";

function DriverList({ name }) {
  const [drivers, setDrivers] = useState([]);
  const [filtroTeams, setFiltroTeams] = useState([]);
  const [selectedTeam, setselectedTeam] = useState("");
  const [selectedOrigin, setselectedOrigin] = useState("");
  const [order, setOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const orders = [
    {
      label: "Alfabetico (a)",
      value: "alfabetico-ascendente",
    },
    {
      label: "Alfabetico (d)",
      value: "alfabetico-descendente",
    },
    {
      label: "nacimiento(a)",
      value: "nacimiento-ascendente",
    },
    {
      label: "nacimiento(d)",
      value: "nacimiento-descendente",
    },
  ];
  const origins = [
    {
      label: "API",
      value: "api",
    },
    {
      label: "DB",
      value: "db",
    },
  ];

  useEffect(() => {
    if (name === "") {
      axios.get("http://localhost:3001/drivers").then(({ data }) => {
        setDrivers(data);
      });
    } else {
      axios
        .get(`http://localhost:3001/drivers/name?name=${name}`)
        .then(({ data }) => {
          setDrivers(data);
        });
    }

    return setDrivers([]);
  }, [name]);

  useEffect(() => {
    axios.get("http://localhost:3001/teams").then(({ data }) => {
      setFiltroTeams(data);
    });
  }, []);

  const handleSelectOrder = (e) => {
    setOrder(e.target.value);
  };

  const handleSelectTeams = (e) => {
    setselectedTeam(e.target.value);
  };

  const handleSelectOrigin = (e) => {
    setselectedOrigin(e.target.value);
  };

  const isSelectedOrigin = (driver) => {
    if (selectedOrigin === "api") {
      return typeof driver.id === "number";
    } else if (selectedOrigin === "db") {
      return typeof driver.id === "string";
    } else {
      return true;
    }
  };

  const isSelectedTeam = (driver) => {
    if (selectedTeam) {
      return driver.teams && driver.teams.includes(selectedTeam);
    } else {
      return true;
    }
  };

  const filteredDrivers = drivers.filter(
    (driver) => isSelectedOrigin(driver) && isSelectedTeam(driver)
  );

  if (order === "alfabetico-ascendente") {
    filteredDrivers.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (order === "alfabetico-descendente") {
    filteredDrivers.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  if (order === "nacimiento-ascendente") {
    filteredDrivers.sort((a, b) => a.nacimiento.localeCompare(b.nacimiento)); //
  } else if (order === "nacimiento-descendente") {
    filteredDrivers.sort((a, b) => b.nacimiento.localeCompare(a.nacimiento));
  }

  function paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size);
      let page = acc[idx] || (acc[idx] = []);
      page.push(val);

      return acc;
    }, []);
  }

  let page_size = 9;
  const pages = paginate(filteredDrivers, page_size);
  const currentPage = pages[pageNumber - 1] || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Drivers</h1>
      <div className={styles.selects}>
        <select
          className={styles.selectOrder}
          value={order}
          onChange={handleSelectOrder}
        >
          <option value="">Select an order</option>
          {orders.map((order) => (
            <option key={order.value} value={order.value}>
              {order.label}
            </option>
          ))}
        </select>

        <select
          className={styles.selectOrder}
          value={selectedOrigin}
          onChange={handleSelectOrigin}
        >
          <option value="">Select an origin</option>
          {origins.map((origin) => (
            <option key={origin.value} value={origin.value}>
              {origin.label}
            </option>
          ))}
        </select>
        <select
          className={styles.selectOrder}
          value={selectedTeam}
          onChange={handleSelectTeams}
        >
          <option value="">Select a team</option>
          {filtroTeams.map((team) => (
            <option key={team.id} value={team.nombre}>
              {team.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <CardContainer cards={currentPage} />
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: pages.length }).map((_, index) => (
          <button
            key={index + 1}
            className={pageNumber === index + 1 ? "active" : ""}
            onClick={() => setPageNumber(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const Card = ({ card }) => {
  return (
    <Link className={styles.card} to={`/detail/${card.id}`} key={card.id}>
      <div className={styles.rectanguloRojo}></div>
      <img src={card.imagen} className={styles.cardImagen} alt={card.nombre} />
      <h3>{card.nombre}</h3>
      <p>{card.teams.join(",")}</p>
    </Link>
  );
};

const CardContainer = ({ cards }) => {
  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <div className={styles.cardContainer}>
          <Card card={card} key={index} />
        </div>
      ))}
    </div>
  );
};

export default DriverList;
