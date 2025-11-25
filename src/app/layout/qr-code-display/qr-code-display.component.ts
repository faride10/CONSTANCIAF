import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Importamos SafeUrl para imágenes Base64 (Admin) y SafeHtml para SVG (Docente)
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { DocenteService } from '../docente.service';

@Component({
  selector: 'app-qr-code-display',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './qr-code-display.component.html',
  styleUrls: ['./qr-code-display.component.css']
})
export class QrCodeDisplayComponent implements OnInit {

  public conferenciaTitulo: string = '';
  public grupoNombre: string = '';
  
  // OPCIÓN A: Para el Docente (SVG Raw)
  public qrHtml: SafeHtml | null = null;
  // OPCIÓN B: Para el Admin (Imagen Base64)
  public qrImage: SafeUrl | null = null;
  
  public isLoading: boolean = true;
  public errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<QrCodeDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    // 1. Títulos (Compatible con ambos)
    this.conferenciaTitulo = this.data.nombreConferencia || 
                             this.data.displayInfo?.conference_name || 
                             'Conferencia';

    this.grupoNombre = this.data.nombreGrupo || 
                       this.data.displayInfo?.group_name || 
                       'Grupo';

    // 2. DECISIÓN INTELIGENTE
    // ¿El Admin ya nos pasó la imagen lista?
    const qrDirecto = this.data.qrCodeBase64 || this.data.qrBase64;

    if (qrDirecto) {
      console.log('Modo Admin: Usando imagen recibida directamente.');
      this.qrImage = this.sanitizer.bypassSecurityTrustUrl(qrDirecto);
      this.isLoading = false;
    } else {
      // Si no hay imagen, intentamos buscarla con el ID (Modo Docente)
      console.log('Modo Docente: Buscando QR en el servidor...');
      this.cargarQR();
    }
  }

  cargarQR() {
    this.isLoading = true;
    this.errorMessage = '';

    // Buscamos el ID (Compatible con ambos formatos por si acaso)
    const idConf = this.data.idConferencia || this.data.id || this.data.ID_CONFERENCIA;

    if (!idConf) {
      this.errorMessage = 'Error: No se recibió el ID ni la imagen del QR.';
      this.isLoading = false;
      return;
    }

    this.docenteService.getQrCode(idConf).subscribe({
      next: (response) => {
        if (response && response.qr_code) {
          // Sanitizamos el SVG
          this.qrHtml = this.sanitizer.bypassSecurityTrustHtml(response.qr_code);
        } else {
          this.errorMessage = 'El servidor no envió el código QR.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar QR:', err);
        this.errorMessage = 'No se pudo cargar el código QR.';
        this.isLoading = false;
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}