import { Component, OnInit, ViewChild } from '@angular/core';
import { TallerServiceDb } from '../../services/tallerdb.service';


import { AutomovilInterface } from '../../interface/taller-interfaces';

import { ModalComponent } from '../../shared/modal/modal.component';


@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styles: [
  ]
})
export class TallerComponent implements OnInit {

  datosDBAutomovil = [];   // * Arreglo de datos substraido de PouchDB
  automovilSeleccionado: AutomovilInterface;
  index;

  @ViewChild(ModalComponent) modal: ModalComponent;


  constructor( private tallerdbService: TallerServiceDb) { // * Inyeccion de nuestro servicio
  }

  ngOnInit(): void {
    this.tallerdbService.obtenerDatos();         // * Llamamos una funcion del Servicio en este caso 'obtenerDatos()' parasubstraer los datos de PouchDB en un arreglo
    this.tallerdbService.sync();                 // * Llamamos una funcion del Servicio en este caso 'sync()' para 'Sincronizar con CouchDB'
    this.tallerdbService.datosDBAutomovil = this.datosDBAutomovil; // * Substraemos el arreglo de dato de nuestro 'datosDBAutomovil = []' ( En el servicio) y le insertamos la informacion a 'this.datosDBAutomovil'
  }

  borrarRegistro(docElegido, i): any{    // * enviaremos el "docElegido" = "dato" y el "i"| que sacamos del <*ngFor="let dato of datosDBAutomovil;  let i = index">
    // console.log('El dato del docElegido apenas llega a la funcion', docElegido);
    this.tallerdbService.borrarDatos(docElegido, i);         // * Llamamos una funcion del Servicio en este caso 'obtenerDatos()' parasubstraer los datos de PouchDB en un arreglo
    // console.log('Se llama a la funcion del servicio');
    // console.log('El dato del docElegido es este', docElegido);
  }


  editarRegistro(registroSeleccionado: AutomovilInterface, i): void{
            console.log(registroSeleccionado, 'Registro seleccionado Desde el taller');
            this.automovilSeleccionado = registroSeleccionado;
            this.index = i;
            this.modal.obtenerAutoSeleccionado();            // * llamamos nuestra funcion importada del hijo

  }

  // actualizarListaRegistro(docElegido , i): any{

  // console.log('Desde el padre llegó esto', docElegido);
  // console.log('Desde el padre llego este index', i);
  // }

}
