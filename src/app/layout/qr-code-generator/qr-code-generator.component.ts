import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConferenceService } from '../conference.service';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  templateUrl: './qr-code-generator.component.html',
  styleUrl: './qr-code-generator.component.css'
})
export class QrCodeGeneratorComponent implements OnInit {

  selectGroupForm: FormGroup;
  grupos: any[] = [];
  isLoadingGrupos = true;
  isLoadingQr = false;
  qrCodeBase64: string | null = null;
  displayInfo: any = null;
  errorMessage: string | null = null;
  conference: any;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QrCodeGeneratorComponent>,
    private conferenceService: ConferenceService
  ) {
    this.conference = data.conferenceData;
    this.selectGroupForm = this.fb.group({
      grupoId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGrupos();
  }

  loadGrupos(): void {
    this.isLoadingGrupos = true;
    this.errorMessage = null;
    this.conferenceService.getGrupos().subscribe({
      next: (data: any) => {
        this.grupos = data;
        this.isLoadingGrupos = false;
      },
      error: (err: any) => {
        console.error('Error al cargar grupos:', err);
        this.errorMessage = 'No se pudieron cargar los grupos.';
        this.isLoadingGrupos = false;
      }
    });
  }

  onGenerateQr(): void {
    if (this.selectGroupForm.invalid) {
      this.qrCodeBase64 = null;
      this.displayInfo = null;
      return;
    }
    this.isLoadingQr = true;
    this.qrCodeBase64 = null;
    this.displayInfo = null;
    this.errorMessage = null;

    const selectedGroupId = this.selectGroupForm.value.grupoId;

    this.conferenceService.getQrData(this.conference.ID_CONFERENCIA, selectedGroupId).subscribe({
      next: (response: any) => {
        this.qrCodeBase64 = response.qr_code_base64;
        this.displayInfo = response.display_info;
        this.isLoadingQr = false;
        console.log('Datos QR recibidos:', response);
      },
      error: (err: any) => {
        console.error('Error al generar QR:', err);
        this.errorMessage = 'Error al generar el código QR.';
        this.isLoadingQr = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}