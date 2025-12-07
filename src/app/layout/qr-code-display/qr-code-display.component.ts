import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  
  public qrHtml: SafeHtml | null = null;
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
    this.conferenciaTitulo = this.data.nombreConferencia || 
                             this.data.displayInfo?.conference_name || 
                             'Conferencia';

    this.grupoNombre = this.data.nombreGrupo || 
                       this.data.displayInfo?.group_name || 
                       'Grupo';

    const qrDirecto = this.data.qrCodeBase64 || this.data.qrBase64;

    if (qrDirecto) {
      console.log('Modo Admin: Usando imagen recibida directamente.');
      this.qrImage = this.sanitizer.bypassSecurityTrustUrl(qrDirecto);
      this.isLoading = false;
    } else {
      console.log('Modo Docente: Buscando QR en el servidor...');
      this.cargarQR();
    }
  }

  cargarQR() {
    this.isLoading = true;
    this.errorMessage = '';

    const idConf = this.data.idConferencia || this.data.id || this.data.id_conferencia;

    if (!idConf) {
      this.errorMessage = 'Error: No se recibió el ID ni la imagen del QR.';
      this.isLoading = false;
      return;
    }

    this.docenteService.getQrCode(idConf).subscribe({
      next: (response) => {
        if (response && response.qr_code) {
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