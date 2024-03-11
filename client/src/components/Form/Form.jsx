import React, { useEffect, useState } from "react";
import styles from "./Form.module.css";
import LandingNav from "../LandingNav/LandingNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Form() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [imagen, setImagen] = useState(null);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [escuderias, setEscuderias] = useState([""]);
  const [errors, setErrors] = useState({});
  const [allTeams, setAllTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/teams").then(({ data }) => {
      setAllTeams(data);
    });
  }, []);

  const validateForm = () => {
    let errors = {};

    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    if (!apellido.trim()) {
      errors.apellido = "El apellido es requerido";
    }

    if (!nacionalidad.trim()) {
      errors.nacionalidad = "La nacionalidad es requerida";
    }

    // if (!imagen) {
    //   errors.imagen = "La imagen es requerida";
    // }

    if (!fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es requerida";
    }

    if (!descripcion.trim()) {
      errors.descripcion = "La descripción es requerida";
    }

    if (escuderias.length === 0) {
      errors.escuderias = "Debes seleccionar al menos una escudería";
    }
    if (
      escuderias.some((escuderia) => {
        return escuderia === "";
      })
    ) {
      errors.escuderias = "Campo Vacio";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImagen(objectURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = {
        nombre,
        apellido,
        nacionalidad,
        imagen,
        nacimiento: fechaNacimiento,
        descripcion,
        teams: escuderias,
      };
      axios
        .post("http://localhost:3001/drivers", data)
        .then(() => {
          alert("Se ha creado el driver con exito!");
          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <LandingNav />
      <div className={styles.container}>
        <h1 className={styles.title}>Formulario de Creación de Nuevo Driver</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre" className={styles.label}>
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              className={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && (
              <span className={styles.error}>{errors.nombre}</span>
            )}
          </div>
          <div>
            <label htmlFor="apellido" className={styles.label}>
              Apellido:
            </label>
            <input
              type="text"
              id="apellido"
              className={styles.input}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            {errors.apellido && (
              <span className={styles.error}>{errors.apellido}</span>
            )}
          </div>
          <div>
            <label htmlFor="nacionalidad" className={styles.label}>
              Nacionalidad:
            </label>
            <input
              type="text"
              id="nacionalidad"
              className={styles.input}
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
            />
            {errors.nacionalidad && (
              <span className={styles.error}>{errors.nacionalidad}</span>
            )}
          </div>
          <div>
            <label htmlFor="imagen" className={styles.label}>
              Imagen:
            </label>
            <input
              type="file"
              id="imagen"
              className={styles.input}
              onChange={handleImageChange}
            />
            {errors.imagen && (
              <span className={styles.error}>{errors.imagen}</span>
            )}
          </div>
          <div>
            <label htmlFor="fechaNacimiento" className={styles.label}>
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              className={styles.input}
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
            {errors.fechaNacimiento && (
              <span className={styles.error}>{errors.fechaNacimiento}</span>
            )}
          </div>
          <div>
            <label htmlFor="descripcion" className={styles.label}>
              Descripción:
            </label>
            <br />
            <textarea
              id="descripcion"
              className={styles.textarea}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            {errors.descripcion && (
              <span className={styles.error}>{errors.descripcion}</span>
            )}
          </div>
          <div>
            <label htmlFor="escuderias" className={styles.label}>
              Teams:
            </label>
            {escuderias.map((escuderia, index) => {
              return (
                <div className={styles.addTeams} key={`${escuderia}-${index}`}>
                  <select
                    key={index}
                    className={styles.select}
                    value={escuderia}
                    onChange={(e) =>
                      setEscuderias(
                        escuderias.map((x, i) => {
                          if (i === index) {
                            return e.target.value;
                          } else {
                            return x;
                          }
                        })
                      )
                    }
                  >
                    <option value={""}>select a team</option>
                    {allTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    className={styles.buttonX}
                    type="button"
                    onClick={() => {
                      setEscuderias(escuderias.filter((x, i) => i !== index));
                    }}
                  >
                    x
                  </button>
                </div>
              );
            })}
            {errors.escuderias && (
              <span className={styles.error}>{errors.escuderias}</span>
            )}
            <div className={styles.buttonAdd}>
              <button
                type="button"
                onClick={() => {
                  setEscuderias([...escuderias, ""]);
                }}
                className={styles.button}
              >
                Add Team
              </button>
            </div>
          </div>
          <button className={styles.buttonSubmit} type="submit">
            Crear Driver
          </button>
        </form>
      </div>
    </>
  );
}

export default Form;
