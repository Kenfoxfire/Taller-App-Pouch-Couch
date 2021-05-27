import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TallerServiceDb } from '../../services/tallerdb.service';

import PouchDB from 'node_modules/pouchdb';
import Swal from 'sweetalert2';

import { PefilInterface } from '../../interface/taller-interfaces';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {


  db;
  formularioPerfil: FormGroup;
  codCliente;
  type;

  datosDBPerfil: PefilInterface;                                            // * Arreglo de datos substraido de PouchDB
  existePerfil;

  constructor( private formbuilder: FormBuilder,
               private tallerdbService: TallerServiceDb,
    ) {

    this.db = new PouchDB('tallerdb');
    this.codCliente = this.tallerdbService.codigoDeCliente;
    this.type = 'perfil';

  }

  ngOnInit(): any {
    this.crearFormulario();
    this.tallerdbService.obtenerDatos();         // * Llamamos una funcion del Servicio en este caso 'obtenerDatos()' parasubstraer los datos de PouchDB en un arreglo
    this.tallerdbService.sync();                 // * Llamamos una funcion del Servicio en este caso 'sync()' para 'Sincronizar con CouchDB'
    this.tallerdbService.obtenerPerfilPRUEBA().then(result => {
      this.datosDBPerfil = result;
      this.obtenerdelservicio();
    }).catch((err) => {
      console.log(err);
      console.log('Ha ocurrido un error');
    });

  }



  // * ---------------------- Obtencion de datos sincrona -------------------------
  // ? Uso de Getter para sincronizar cambios en el formulario
  // TODO  EN EL HTML se llaman las funciones Getter para validar si es "true" or "False" la validacion que se hara entre llaves cuadradas "lo controla Angular" []
  // TODO  Se coloca la clase "is-invalid" y ademas se valida con "ngIf" para el "<small>" si la validacion del "[class.is-invalid]" es "True"

  get nombreNoValido(): any{
    return this.formularioPerfil.get('nombre').invalid && this.formularioPerfil.get('nombre').touched;
  }


  get numeroNoValido(): any{
    return this.formularioPerfil.get('numero').invalid && this.formularioPerfil.get('numero').touched;
  }


  get correoNoValido(): any{
    return this.formularioPerfil.get('correo').invalid && this.formularioPerfil.get('correo').touched;
  }



  // * -------------------- Validaciones -----------------------------------------------------------------------------


  crearFormulario(): any{
    this.formularioPerfil = this.formbuilder.group({
      nombre      : ['', [Validators.required, Validators.minLength(3)]],
      numero      : ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]], // * Uso de Expresiones regulares, para identificar
      correo      : ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],   // * un Correo o numero etc etc.
    });

  }




  // * -------------------- Obtencion del perfil en caso de haber informacion ----------------------------------------

  obtenerdelservicio(): any{
    // console.log('este es el datosDBPerfil del perfil ', this.datosDBPerfil);
    if (this.datosDBPerfil) {
      this.existePerfil = true;
      this.formularioPerfil.setValue({
        nombre: this.datosDBPerfil.nombre,
        numero: this.datosDBPerfil.numero,
        correo: this.datosDBPerfil.correo,
      });
    }
      else {
      this.existePerfil = false;
      }
  }



 // * ------------ Creacion || Actualizacion de datos, y validaciones de datos en blanco-------------------------------------------

  guardar(): any {
    // console.log(this.formularioPerfil);


    if ( this.formularioPerfil.invalid ) {

      return  Object.values( this.formularioPerfil.controls ).forEach( control => {
        control.markAsTouched();
      });

    }

    Swal.fire({                                  // * ALERTA
      title: 'Espere',
      text: 'Actualizando registro',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();





    this.saveForm();                           // * Llamamos a la funcion para guardar datos en nuestra base de datos




    Swal.fire({                                 // * ALERTA
    title: this.formularioPerfil.value.nombre,
    text: 'Su perfil se guardo correctamente',
    icon: 'success',
    });

    // this.tallerdbService.obtenerDatos();       // * Llamamos una funcion del Servicio en este caso "obtenerDatos()" para substraer los datos de PouchDB en un arreglo





  }





// * ------------------------- Ingreso de datos por "PUT" en PouchDB ----------------

// * ------------------------- Funcion declarada-------------------------------------

  saveForm(): any {

    if (!this.existePerfil) {                                  // ? Si no existe el perfil, Crearemos uno

        const perfilFormularioGuardar: PefilInterface = {
          _id: new Date().toISOString(),
          type: this.type,
          codCliente: this.codCliente,
          nombre: this.formularioPerfil.value.nombre,
          numero: this.formularioPerfil.value.numero,
          correo: this.formularioPerfil.value.correo
        };

        this.db.put(perfilFormularioGuardar)                                     // * Enviamos los datos a Pouch
        .then((result) => {  // ! Nunca usar ".post" ya que genera ID randoms

        console.log('SE ENVIA A POUCH');
        console.log(result);
        console.log(perfilFormularioGuardar);
        this.existePerfil = true;

        // this.tallerdbService.sync();               // * Llamamos una funcion del Servicio en este caso "sync()" para "Sincronizar con CouchDB"


      }).catch((err) => {                            // * Alerta en caso de error
        Swal.fire('Algo anda mal', err , 'error');
        console.log('Algo anda mal!');
        console.log(err);

      });

    }else {                                                  // ? Si existe el perfil, o actualizaremos

      const perfilFormularioGuardar = {                      // TODO mantenemos el _id, type, codCliente y nuestro _rev y actualizamos lo demas
        _id: this.datosDBPerfil._id,
        type: this.datosDBPerfil.type,
        codCliente: this.datosDBPerfil.codCliente,
        nombre: this.formularioPerfil.value.nombre,
        numero: this.formularioPerfil.value.numero,
        correo: this.formularioPerfil.value.correo,
        _rev : this.datosDBPerfil._rev
      };



      this.db.put(perfilFormularioGuardar);                                     // * Enviamos los datos a Pouch




      this.tallerdbService.obtenerPerfilPRUEBA().then(result => {        // TODO   IMPORTANTE!!! llamamos nuestra funcion Asincrona para que se genere un nuevo _rev, asi
        this.datosDBPerfil = result;                                     // TODO   Podremos actualizar otro dato sin cargar de nuevo el mpodulo
        this.obtenerdelservicio();
      }).catch((err) => {
        console.log(err);
        console.log('Ha ocurrido un error');
      })

      .then((result) => {
        console.log('SE actualiza EN POUCH');
        console.log(result);
        console.log(perfilFormularioGuardar);


        // this.tallerdbService.sync();               // * Llamamos una funcion del Servicio en este caso "sync()" para "Sincronizar con CouchDB"


      }).catch((err) => {
        console.log(err);
        Swal.fire('Algo anda mal', err , 'error');
        console.log('Algo anda mal!');
        console.log(err);
      });






    }



  }


}
