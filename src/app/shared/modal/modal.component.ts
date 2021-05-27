import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import PouchDB from 'node_modules/pouchdb';
import { TallerServiceDb } from '../../services/tallerdb.service';
import { AutomovilInterface } from '../../interface/taller-interfaces';
import Swal from 'sweetalert2';
import { TallerComponent } from '../../pages/taller/taller.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: [
  ]
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() automovilSeleccionado: AutomovilInterface;           // * Decorador Input declarado para traer datos del padre a esta componenete hijo
  @Input() index;                                                // * Decorador Input declarado para traer datos del padre a esta componenete hijo


  db;                           // ? Constante para inyectar la base de datos
  formularioAutomovil: FormGroup;             // ? Constante para utilizar Formulario reactivos
  codCliente;
  type;



  constructor( private formbuilder: FormBuilder,
               private tallerdbService: TallerServiceDb

) {

      this.db = new PouchDB('tallerdb');    // ? inyeccion de la base de datos con el nombre "tallerdb"
      this.codCliente = 10;
      this.type = 'automovil';
     }




     ngOnInit(): void {
      this.crearFormulario();               // ? en el ngOnInit se inicializa la funcion para crear el formreactive

    }

    ngOnDestroy(): void {

//  this.tallerdbService.obtenerDatos();       // * Llamamos una funcion del Servicio en este caso "obtenerDatos()" para substraer los datos de PouchDB en un arreglo
//  this.tallerdbService.sync();               // * Llamamos una funcion del Servicio en este caso "sync()" para "Sincronizar con CouchDB"



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
        _rev      : ['', ],
      });

    }



    recibiendoDatos(): any{                                     // * Se utiliza para darle un tiempo determinado ya que el dato no llega sincrono del hijo
      // Simulate a code delay
      setTimeout( () => {
        Swal.close();
        this.formularioAutomovil.setValue({
          dueno: this.automovilSeleccionado.dueno,
          marcaModelo: this.automovilSeleccionado.marcaModelo,
          placa: this.automovilSeleccionado.placa,
          _rev: this.automovilSeleccionado._rev
          });
        console.log(this.automovilSeleccionado, 'Registro seleccionado Desde Modal ya modificado');
      }, 200 );

    }

    obtenerAutoSeleccionado(): any{

      console.log(this.automovilSeleccionado, 'Registro seleccionado Desde Modal');
      Swal.fire({                                  // * ALERTA
        title: 'Espere',
        text: 'Guardando informularioAutomovilcion',
        icon: 'info',
        allowOutsideClick: false
      });
      Swal.showLoading();
      this.recibiendoDatos();

    }
    guardar(): any {
      console.log('Holi vas a guardar?');
      console.log(this.automovilSeleccionado);
      console.log(this.index);


      if ( this.formularioAutomovil.invalid ) {

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





      this.saveForm();                           // * Llamamos a la funcion para guardar datos en nuestra base de datos




      Swal.fire({                                 // * ALERTA
      title: this.formularioAutomovil.value.nombre,
      text: 'Su perfil se edito correctamente',
      icon: 'success',
      });



      // this.tallerdbService.obtenerDatos();       // * Llamamos una funcion del Servicio en este caso "obtenerDatos()" para substraer los datos de PouchDB en un arreglo

    }

    saveForm(): any {
      console.log('Editando');
      const automovilFormGuardar: AutomovilInterface = {
        _id: this.automovilSeleccionado._id,
        type: this.automovilSeleccionado.type,
        codCliente: this.automovilSeleccionado.codCliente,
        dueno: this.formularioAutomovil.value.dueno,
        marcaModelo: this.formularioAutomovil.value.marcaModelo,
        placa: this.formularioAutomovil.value.placa,
        _rev: this.automovilSeleccionado._rev
      };

      this.db.put(automovilFormGuardar)
      .then((result) => {  // ! Nunca usar ".post" ya que genera ID randoms

      console.log('SE ENVIA A POUCH');
      console.log(result);
      console.log(automovilFormGuardar);

      this.tallerdbService.actualizarDatoEditado( automovilFormGuardar, this.index);    // ! Nuevo

      // this.tallerdbService.sync();               // * Llamamos una funcion del Servicio en este caso "sync()" para "Sincronizar con CouchDB"




      }).catch((err) => {                            // * Alerta en caso de error
        Swal.fire('Algo anda mal', err , 'error');
        console.log('Algo anda mal!');
        console.log(err);

      });
    }


}
