const { Router } = require("express");
const { Driver, Team } = require("../db");
const router = Router();
const axios = require("axios");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

// crea una constante driver en donde devuelve un array vacio
// crea una constante driversWhithdefaultimage en donde devuelve una imagen por defecto si el corredor no tiene imagen
router.get("/", async (req, res) => {
  try {
    const driversDb = await Driver.findAll({ include: "teams" });
    const driversApi = await axios.get("http://localhost:5000/drivers");

    const formattedDriversApi = driversApi.data.map((driver) => {
      return {
        id: driver.id,
        nombre: driver.name.forename,
        apellido: driver.name.surname,
        descripcion: driver.description,
        imagen: driver.image.url || "URL_IMAGEN_POR_DEFECTO",
        nacionalidad: driver.nationality,
        nacimiento: driver.dob,
        teams: driver.teams ? driver.teams.split(",") : [],
      };
    });

    const formattedDriversDb = driversDb.map((driver) => ({
      ...driver.toJSON(),
      teams: driver.teams ? driver.teams.map((team) => team.nombre) : [],
      imagen: driver.imagen || "URL_IMAGEN_POR_DEFECTO",
    }));
    const drivers = formattedDriversDb.concat(formattedDriversApi);
    res.send(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

//crea una constante llamada driver en donde guarda todos los driver cuyo
// nombre sea igual al pasado por parametro
function capitalizeEachWord(str) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
router.get("/name", async (req, res) => {
  try {
    const searchName = req.query.name || "";
    const url = `http://localhost:5000/drivers?name.forename=${capitalizeEachWord(
      searchName
    )}`;
    console.log(url);
    const driversApi = await axios.get(url);
    const formattedDriversApi = driversApi.data.map((driver) => {
      return {
        id: driver.id,
        nombre: driver.name.forename,
        apellido: driver.name.surname,
        descripcion: driver.description,
        imagen: driver.image.url || "URL_IMAGEN_POR_DEFECTO",
        nacionalidad: driver.nationality,
        nacimiento: driver.dob,
        teams: driver.teams ? driver.teams.split(",") : [],
      };
    });

    const driversDb = await Driver.findAll({
      where: {
        nombre: { [Op.iLike]: `%${searchName.toLowerCase()}%` },
      },
      limit: 15,
    });

    const formattedDriversDb = driversDb.map((driver) => ({
      ...driver.toJSON(),
      teams: driver.teams ? driver.teams.map((team) => team.nombre) : [],
      imagen: driver.imagen || "URL_IMAGEN_POR_DEFECTO",
    }));

    const drivers = formattedDriversDb.concat(formattedDriversApi).slice(0, 15);

    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// findByPk es un método de Sequelize que obtiene una sola entrada de una tabla, utilizando la clave principal proporcionada.
//crea una constante llamada driver en donde guarda el corredor cuyo id es el pasado por parametro
function esUUID(str) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
router.get("/:id", async (req, res) => {
  try {
    const driverId = req.params.id;

    if (esUUID(driverId)) {
      const driverDb = await Driver.findByPk(driverId, {
        include: [{ model: Team, as: "teams" }],
      });
      const formattedDriversDb = {
        ...driverDb.toJSON(),
        teams: driverDb.teams ? driverDb.teams.map((team) => team.nombre) : [],
        imagen: driverDb.imagen || "URL_IMAGEN_POR_DEFECTO",
      };

      if (formattedDriversDb) {
        return res.send(formattedDriversDb);
      }
    } else {
      const driver = await axios.get(
        `http://localhost:5000/drivers/${driverId}`
      );

      if (driver.data) {
        const formattedDriver = {
          id: driver.data.id,
          nombre: driver.data.name.forename,
          apellido: driver.data.name.surname,
          descripcion: driver.data.description,
          imagen: driver.data.image.url || "URL_IMAGEN_POR_DEFECTO",
          nacionalidad: driver.data.nationality,
          nacimiento: driver.data.dob,
          teams: driver.data.teams ? driver.data.teams.split(",") : [],
        };

        return res.send(formattedDriver);
      }
    }

    return res.status(404).json({ error: "Driver no encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Paso 1: Obtener los datos del body
    const { nombre, apellido, descripcion, nacionalidad, nacimiento, teams } =
      req.body;
    // Paso 2: Verificar que se proporcionaron al menos un nombre y un equipo
    if (!nombre || !teams || teams.length === 0) {
      return res
        .status(400)
        .json({ error: "Nombre y al menos un equipo son obligatorios" });
    }
    let imagen = req.body.imagen;
    console.log(imagen);
    if (!imagen) {
      const defaultImagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "senna.jpg"
      );
      imagen = fs.readFileSync(defaultImagePath);
    }
    // Paso 3: Crear el driver en la base de datos
    const newDriver = await Driver.create({
      nombre,
      apellido,
      descripcion,
      nacionalidad,
      nacimiento,
      imagen,
    });

    // Paso 4: Relacionar el driver con los equipos indicados
    await newDriver.addTeams(teams);

    // Paso 5: Devolver el nuevo driver creado
    res.status(201).json(newDriver);
  } catch (error) {
    // Paso 6: Manejar errores
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
