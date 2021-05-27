import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { TallerServiceDb } from '../../services/tallerdb.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  formulariLogin: FormGroup;             // ? Constante para utilizar Formulario reactivos
  codCliente: number;

  constructor( private formbuilder: FormBuilder,
               private tallerdbService: TallerServiceDb) {
               }

  ngOnInit(): void {
    this.crearFormulario();
    this.colocarCodigo();
  }

  get codigoNoValido(): any{
    return this.formulariLogin.get('codigo').invalid && this.formulariLogin.get('codigo').touched;  // ? En caso de que el valor
  }


  crearFormulario(): any{
    this.formulariLogin = this.formbuilder.group({
      codigo      : ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]],
    });

  }


  colocarCodigo(): any{                                      // * Se coloca el codigo actual en el form
    if (this.tallerdbService.codigoDeCliente) {
      this.formulariLogin.setValue({
        codigo: this.tallerdbService.codigoDeCliente,
      });
    }

  }



  guardar(): any {

      if ( this.formulariLogin.invalid ) { // ? En caso de ser un Formulario Invalido al ejecutar "guardar()" retorna a todos los campos "control" del formulario, un valor "touched"
                                // ? Ensuciando el

      return  Object.values( this.formulariLogin.controls ).forEach( control => {
        control.markAsTouched();
      });

    }

      Swal.fire({                                  // * ALERTA
      title: 'Espere',
      text: 'Guardando informulariLogincion',
      icon: 'info',
      allowOutsideClick: false
    });
      Swal.showLoading();


      this.codCliente = this.formulariLogin.value.codigo;


      Swal.fire({                                 // * ALERTA
    title: this.formulariLogin.value.marcaModelo,
    text: 'Ingresó correctamente',
    icon: 'success',
    });
      console.log('Guardando');
      console.log(this.codCliente);
      this.tallerdbService.codigoDeCliente = this.codCliente;
      console.log(this.codCliente);
      this.colocarCodigo();

  }



}
