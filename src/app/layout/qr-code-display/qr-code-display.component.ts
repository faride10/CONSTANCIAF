import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// 1. Importamos DomSanitizer y SafeUrl para manejar la imagen Base64
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-code-display',  
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  // Ya no necesitamos CUSTOM_ELEMENTS_SCHEMA porque usamos una imagen normal <img>
  templateUrl: './qr-code-display.component.html',
  styleUrls: ['./qr-code-display.component.css']
})
export class QrCodeDisplayComponent implements OnInit {

  public conferenciaTitulo: string = '';
  public grupoNombre: string = '';
  
  // 2. Aquí declaramos la variable que te faltaba
  public safeQrData: SafeUrl | null = null;

  constructor(
    public dialogRef: MatDialogRef<QrCodeDisplayComponent>,
    // Nota: Asumo que estás pasando la respuesta completa de tu API aquí
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private sanitizer: DomSanitizer
  ) {}

ngOnInit(): void {
    // 1. IMPRIMIR EN CONSOLA LO QUE LLEGA (Para depurar)
    console.log('---- DATOS RECIBIDOS EN EL MODAL ----');
    console.log(this.data);
    
    if (this.data) {
      // Asignar textos (esto ya te funcionaba)
      this.conferenciaTitulo = this.data.displayInfo?.conference_name || this.data.nombreConferencia || '';
      this.grupoNombre = this.data.displayInfo?.group_name || this.data.nombreGrupo || '';

      // 2. BÚSQUEDA ROBUSTA DE LA IMAGEN
      // Buscamos la imagen en cualquiera de los nombres probables (con o sin error de dedo)
      const imagenRecibida = this.data.qrCodeBased64 || // Tu backend (con error de dedo)
                             this.data.qrBase64 ||      // Tu código antiguo
                             this.data.qrCodeBase64;    // Nombre corregido

      if (imagenRecibida) {
        console.log('Imagen encontrada, procesando...');
        this.safeQrData = this.sanitizer.bypassSecurityTrustUrl(imagenRecibida);
      } else {
        console.error('ERROR: No se encontró ninguna propiedad con la imagen Base64 en "this.data"');
      }
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}