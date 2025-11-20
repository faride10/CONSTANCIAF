import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; 
import { DocenteService } from '../docente.service'; 
import { MatProgressBarModule } from '@angular/material/progress-bar'; 

@Component({
  selector: 'app-docente-import',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatProgressBarModule 
  ],
  templateUrl: './docente-import.component.html',
  styleUrls: ['./docente-import.component.css']
})
export class DocenteImportComponent {   

  archivoSeleccionado: File | null = null;
  cargando: boolean = false;
  errorMensaje: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DocenteImportComponent>,
    private docenteService: DocenteService 
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      this.errorMensaje = null;
    }
  }

  importar(): void {
    if (!this.archivoSeleccionado) {
      this.errorMensaje = 'Por favor, selecciona un archivo .csv para continuar.';
      return;
    }
    this.cargando = true;
    this.errorMensaje = null;
    this.docenteService.importarDocentes(this.archivoSeleccionado).subscribe(
      (response: any) => {
        this.cargando = false;
        console.log('Importación exitosa:', response);
        this.dialogRef.close(true); 
      },
      (error: any) => {
        this.cargando = false;
        console.error('Error en la importación:', error);
        
        if (error.status === 422 && error.error.errors) {
          this.errorMensaje = 'El archivo tiene errores. Revisa la consola para más detalles.';
        } else {
          this.errorMensaje = 'Error al subir el archivo. Intenta de nuevo.';
        }
      }
    );
  }

  cerrarModal(): void {
    this.dialogRef.close(false);
  }
}