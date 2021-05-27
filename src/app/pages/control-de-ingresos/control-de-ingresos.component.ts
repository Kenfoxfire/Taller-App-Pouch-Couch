
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';


import PouchDB from 'node_modules/pouchdb';
import { TallerServiceDb } from '../../services/tallerdb.service';

import Swal from 'sweetalert2';

import { AutomovilInterface } from '../../interface/taller-interfaces';


@Component({
  selector: 'app-control-de-ingresos',
  templateUrl: './control-de-ingresos.component.html',
  styles: []
})
export class ControlDeIngresosComponent implements OnInit {




  db;                           // ? Constante para inyectar la base de datos
  formularioAutomovil: FormGroup;             // ? Constante para utilizar Formulario reactivos
  codCliente;
  type;




  constructor( private formbuilder: FormBuilder,
               private tallerdbService: TallerServiceDb,
    ) {



    this.db = new PouchDB('tallerdb');    // ? inyeccion de la base de datos con el nombre "tallerdb"
    this.codCliente = this.tallerdbService.codigoDeCliente;
    this.type = 'automovil';

  }

  ngOnInit(): void {
    this.crearFormulario();               // ? en el ngOnInit se inicializa la funcion para crear el formreactive
  }

  // * ---------------------- Obtencion de datos sincrona -------------------------
  // ? Uso de Getter para sincronizar cambios en el formulario
  // TODO  EN EL HTML se llaman las funciones Getter para validar si es "true" or "False" la validacion que se hara entre llaves cuadradas "lo controla Angular" []
  // TODO  Se coloca la clase "is-invalid" y ademas se valida con "ngIf" para el "<small>" si la validacion del "[class.is-invalid]" es "True"


  get duenoNoValido(): any{
    return this.formularioAutomovil.get('dueno').invalid && this.formularioAutomovil.get('dueno').touched;  // ? En caso de que el valor
  }


  get marcaModeloNoValido(): any{
    return this.formularioAutomovil.get('marcaModelo').invalid && this.formularioAutomovil.get('marcaModelo').touched;
  }


  get placaNoValido(): any{
    return this.formularioAutomovil.get('placa').invalid && this.formularioAutomovil.get('placa').touched;
  }

  // * -------------------- Validaciones ----------------------------------------

  crearFormulario(): any{
    this.formularioAutomovil = this.formbuilder.group({
      dueno      : ['', [Validators.required, Validators.minLength(3)]],
      marcaModelo: ['', [Validators.required, Validators.minLength(5)]],
      placa      : ['', [Validators.required, Validators.minLength(6)]],
    });

  }



// * ------------------------- Ingreso de datos por "PUT" en PouchDB ----------------

// * ------------------------- Funcion declarada-------------------------------------
  saveForm(): any {

      const automovilFormGuardar: AutomovilInterface = {
        _id: new Date().toISOString(),
        type: this.type,
        codCliente: this.codCliente,
        dueno: this.formularioAutomovil.value.dueno,
        marcaModelo: this.formularioAutomovil.value.marcaModelo,
        placa: this.formularioAutomovil.value.placa
      };

      this.db.put(automovilFormGuardar)
      .then((result) => {  // ! Nunca usar ".post" ya que genera ID randoms

      console.log('SE ENVIA A POUCH');
      console.log(result);
      console.log(automovilFormGuardar);

      this.tallerdbService.sync();               // * Llamamos una funcion del Servicio en este caso "sync()" para "Sincronizar con CouchDB"


      }).catch((err) => {                            // * Alerta en caso de error
        Swal.fire('Algo anda mal', err , 'error');
        console.log('Algo anda mal!');
        console.log(err);

      });
    }



  // * ------------  Validacion de campos vacios al ejecutar y escritura de datos ----------------------

  guardar(): any {


    if ( this.formularioAutomovil.invalid ) { // ? En caso de ser un Formulario Invalido al ejecutar "guardar()" retorna a todos los campos "control" del formulario, un valor "touched"
                                // ? Ensuciando el

      return  Object.values( this.formularioAutomovil.controls ).forEach( control => {
        control.markAsTouched();
      });

    }

    Swal.fire({                                  // * ALERTA
      title: 'Espere',
      text: 'Guardando informularioAutomovilcion',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.saveForm();                           // * Llamamos a la funcion para guardar datos




    Swal.fire({                                 // * ALERTA
    title: this.formularioAutomovil.value.marcaModelo,
    text: 'Ingresó correctamente',
    icon: 'success',
    });

    this.formularioAutomovil.reset();                        // * Metodo "reset()" nos devuelve los valores untoched y borra los argumentos del formulario
    this.tallerdbService.obtenerDatos();       // * Llamamos una funcion del Servicio en este caso "obtenerDatos()" para substraer los datos de PouchDB en un arreglo

  }














  // guardar( form: NgForm ){
  //   console.log(form);
  //   console.log(this.vehiculo);
  // }


}
