import { AutomovilInterface, PefilInterface } from '../interface/taller-interfaces';
import { Injectable } from '@angular/core';
import PouchDB from 'node_modules/pouchdb';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TallerServiceDb {

  db;          // ? Constante para inyectar la base de datos

  remoteCouch; // ? Constante para inyectar la base de datos Remota

  syncDom;     // ! EN DES USO, ALRETA DE SICRONIZACION EN HTML

  nombreBD;

  datosDBAutomovil: AutomovilInterface[] = [];                                            // * Arreglo de datos substraido de PouchDB
  datosDBPerfil: PefilInterface;                                            // * Arreglo de datos substraido de PouchDB


  codigoDeCliente: number; // ! Nuevo

  datoDBAutomovilActualizado: AutomovilInterface;       // ! Nuevo
  indexDelDatoActualizado: number;                      // ! Nuevo

  constructor() {
    this.nombreBD = 'tallerdb';
    this.db = new PouchDB(this.nombreBD);                     // ! Se declara nuestra Base de datos local PouchDB llamada 'tallerdb' (dato guardado en this.nombreBD) todos
    // this.remoteCouch = `http://localhost:5984/${this.nombreBD}`;      // ! Se constituye la base de datos Remota a la direccion de nuestra CouchDB
    this.remoteCouch = `http://192.168.0.4:5984/${this.nombreBD}`;      // ! Prueba con red interna de mi Hogar setAttribute


  }


  sync(): any {                                                        // TODO           Sincronizacion de datos a CouchDB y Viceversa
    // this.syncDom = document.getElementById('sync-wrapper');
    // this.syncDom.setAttribute('data-sync-state', 'syncing');
    // const opts = {live: true, retry: true};
    // this.db.replicate.to(this.remoteCouch, opts, this.syncError);
    // this.db.replicate.from(this.remoteCouch, opts, this.syncError);
    // console.log('SE REPLICA EN COUCH POUCH');




    this.db.sync(this.remoteCouch, {          // ? POR GESTIONAR  ||||||||||- MUY PRONTO!!!!
      live: true,
      retry: true
    }).on('change', change => {
      // yo, something changed!
    console.log('SE REPLICA hubo un cambio EN COUCH POUCH');
    console.log(change);

    }).on('paused', info => {
      console.log('pausado');
      console.log(info);
      console.log(this.codigoDeCliente);
      // replication was paused, usually because of a lost connection
    }).on('active', info => {
      // replication was resumed
      console.log('SE activó REPLICA EN COUCH POUCH');
      console.log(info);
    }).on('error', err => {
      console.log('ocurrio un error al sincronizar');
      console.log(err);

      // totally unhandled error (shouldn't happen)
    });





  }

  // syncError(error): any {                                       // ! EN DES USO, ALERTA DE SICRONIZACION EN HTML
  // //  this.syncDom.setAttribute('data-sync-state', 'error');
  // console.log('Ha ocurrido un error durante la sincronizacion');
  // console.log(error);
  // }


  obtenerPerfilPRUEBA(): any{


    return new Promise(( resultado) => {

      resultado(    this.db.allDocs({include_docs: true, descending: false})
      .then((result) => {
        // console.log('SE ACTIVA OBTENER DATOS');
        result.rows.forEach( row => {                         // ? Optimizacion de codigo  uso de 'forEach' para el arreglo 'row'



        if (row.doc.type === 'perfil' && row.doc.codCliente === this.codigoDeCliente) {
          // console.log(row.doc);
          // return row.doc;
          resultado(row.doc);
        } else {
          // console.log('No hay nada');
              }
        });
      })
      .catch((err) => {
        console.log(err);
        console.log('Ha ocurrido un error');
      })
  );

    });


  }


  obtenerDatos(): any{                                      // *  Substrae los datos de PouchDB en un arreglo con Promesa
    this.db.allDocs({include_docs: true, descending: false})
    .then((result) => {

      result.rows.forEach( row => {                         // ? Optimizacion de codigo  uso de 'forEach' para el arreglo 'row'

      if (row.doc.codCliente === this.codigoDeCliente) {


        if (row.doc.type === 'automovil') {

          this.datosDBAutomovil.push(row.doc);                         // * los resultados de cada 'doc'uemento de la 'row'(fila de datos) se empujan a nuestro arreglo 'datosDBAutomovil'
        } else {

              if (row.doc.type === 'perfil') {
                this.datosDBPerfil = (row.doc);                         // * los resultados de cada 'doc'uemento de la 'row'(fila de datos) se empujan a nuestra const 'datosDBPerfil'
              }

              }
      }


      });


    })
    .catch((err) => {

      console.log(err);
      console.log('Ha ocurrido un error');

    });
  }


  borrarDatos(docElegido, i): any{

                                 // * La funcion get eb PouchDB funciona enviando todo el doc , o el ID y rev


    Swal.fire({
    title: 'ATENCION',
    text: `Está seguro que desea borrar a ${docElegido.marcaModelo}?`,
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    })
    .then((result) =>  {

      if ( result.value ) {

            this.db.remove(docElegido);
            this.datosDBAutomovil.splice(i, 1);         // * Usamos el metodo "splice" para eliminar 1 registro de nuestro arreglo en  la psicion del index
            console.log(docElegido.marcaModelo, '  eliminado');
            return;
      }

      console.log(docElegido.marcaModelo, '  no eliminado');
    })
    .catch( (err)  => {
      console.log('error inesperado');
      console.log(err);
    });
  }


  actualizarDatoEditado( datoEditado: AutomovilInterface, i): any{
    this.datoDBAutomovilActualizado = datoEditado;       // ! Nuevo
    this.indexDelDatoActualizado = i;                      // ! Nuevo
    console.log('Datos en el service');
    console.log(this.datoDBAutomovilActualizado, this.indexDelDatoActualizado);


    this.db.allDocs({include_docs: true, descending: false})
    .then((result) => {

      result.rows.forEach( row => {

      if (row.doc._id === this.datoDBAutomovilActualizado._id) {  // ? Traemos el nuevo registro creado en Pouch, se hace de esta manera para poder editar de nuevo un registro. sin recargar de nuevo

        console.log(row.doc, 'Importante dato con nuevo _rev');                     // * los resultados de cada 'doc'uemento de la 'row'(fila de datos) se empujan a nuestro arreglo 'datosDBAutomovil'
        this.datosDBAutomovil[i] = row.doc;

      }
      });


    })
    .catch((err) => {

      console.log(err);
      console.log('Ha ocurrido un error');

    });

  }

}
