export interface AutomovilInterface {

  _id: string;
  type: string;
  codCliente: number;
  dueno: string;
  marcaModelo: string;
  placa: string;
  _rev?: string;
}

export interface PefilInterface {

  _id: string;
  type: string;
  codCliente: number;
  nombre: string;
  numero: number;
  correo: string;
  _rev?: string;

}
