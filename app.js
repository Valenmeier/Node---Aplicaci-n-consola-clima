import {
  inquirerMenu,
  leerInput,
  listadoLugares,
  pausa,
} from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    console.clear();
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const termino = await leerInput("Ciudad: ");

        // Buscar los lugares
        const lugares = await busquedas.ciudad(termino);

        // Seleccionar el lugar
        const idSeleccionado = await listadoLugares(lugares);

        if (idSeleccionado !== 0) {
          const lugarSeleccionado = await lugares.find(
            (lugar) => lugar.id === idSeleccionado
          );
          busquedas.agregarHistorial(lugarSeleccionado.nombre);

          //Clima
          const clima = await busquedas.climaLugar(
            lugarSeleccionado.lat,
            lugarSeleccionado.lng
          );

          //Mostrar resultados
          console.clear();
          console.log(`\nInformación de la ciudad\n`);
          console.log(`Ciudad:`, lugarSeleccionado.nombre);
          console.log(`Latitud: `, lugarSeleccionado.lat);
          console.log(`Longitud:`, lugarSeleccionado.lng);
          console.log(`Temperatura: `, clima.temp);
          console.log(`Temperatura mínima: `, clima.min);
          console.log(`Temperatura máxima:`, clima.max);
          console.log(`Como se ve el clima:`, clima.desc);
        } else {
          console.log("Cancelado exitosamente".red);
        }

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.cyan;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
