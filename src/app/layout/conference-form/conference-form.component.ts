import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list'; 
import { ConferenceService } from '../conference.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { GrupoService } from '../grupo.service';
import { QrCodeDisplayComponent } from '../qr-code-display/qr-code-display.component';

@Component({
  selector: 'app-conference-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule, 
  ],
  templateUrl: './conference-form.component.html',
  styleUrl: './conference-form.component.css'
})
export class ConferenceFormComponent implements OnInit {
  conferenceForm: FormGroup;
  ponentes: any[] = [];
  grupos: any[] = []; 
  isLoadingPonentes = false;
  errorMessage: string | null = null;
  isEditMode: boolean = false;
  currentConferenceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConferenceFormComponent>,
    private conferenceService: ConferenceService,
    private grupoService: GrupoService, 
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: { conferenceData: any }
  ) {

    if (data && data.conferenceData) {
      this.isEditMode = true;
      const conference = data.conferenceData;
      this.currentConferenceId = conference.ID_CONFERENCIA;
      
      const fechaHora = conference.FECHA_HORA ? new Date(conference.FECHA_HORA) : null;

      this.conferenceForm = this.fb.group({
        FECHA: [fechaHora, Validators.required],
        HORA: [fechaHora ? fechaHora.toTimeString().substring(0, 5) : null, Validators.required],
        NOMBRE_CONFERENCIA: [conference.NOMBRE_CONFERENCIA, Validators.required],
        TEMA: [conference.TEMA],
        LUGAR: [conference.LUGAR, Validators.required],
        NUM_PARTICIPANTES: [conference.NUM_PARTICIPANTES, Validators.pattern('^[0-9]*$')],
        ID_PONENTE: [conference.ID_PONENTE],
        grupos: [conference.grupos ? conference.grupos.map((g: any) => g.ID_GRUPO) : []] 
      });

    } else {
      this.isEditMode = false;
      this.conferenceForm = this.fb.group({
        NOMBRE_CONFERENCIA: ['', Validators.required],
        TEMA: [''],
        FECHA: [null, Validators.required],
        HORA: [null, Validators.required],
        LUGAR: ['', Validators.required],
        NUM_PARTICIPANTES: [null, Validators.pattern('^[0-9]*$')],
        ID_PONENTE: [null],
        grupos: [[]] 
      });
    }
  }

  ngOnInit(): void {
    this.loadPonentes();
    this.loadGrupos(); 
  }

  loadPonentes(): void {
    this.conferenceService.getPonentes().subscribe({
      next: (data: any) => { this.ponentes = data; },
      error: (err: any) => { console.error('Error al cargar ponentes:', err); }
    });
  }

  loadGrupos(): void {
     this.grupoService.getGrupos().subscribe({
      next: (data: any) => { this.grupos = data; },
      error: (err: any) => { console.error('Error al cargar grupos', err); }
    });
  }

  onGenerateQr(grupoId: number, event: MouseEvent): void {
    event.stopPropagation(); 
    event.preventDefault();

    if (!this.currentConferenceId) return;

    const grupoEncontrado = this.grupos.find(g => g.ID_GRUPO === grupoId);
    const nombreGrupo = grupoEncontrado ? grupoEncontrado.NOMBRE : 'Grupo';
    const nombreConferencia = this.conferenceForm.get('NOMBRE_CONFERENCIA')?.value;

    this.dialog.open(QrCodeDisplayComponent, {
      width: '400px',
      data: { 
        idConferencia: this.currentConferenceId,  
        nombreConferencia: nombreConferencia,     
        nombreGrupo: nombreGrupo                
      }
    });
  }
  
  isGrupoSelected(grupoId: number): boolean {
    const selectedGrupos = this.conferenceForm.get('grupos')?.value || [];
    return selectedGrupos.includes(grupoId);
  }

  private prepareSaveData(): any {
    const formValues = this.conferenceForm.value;

    const fecha = new Date(formValues.FECHA);
    
    const [horas, minutos] = formValues.HORA.split(':');

    fecha.setHours(parseInt(horas, 10));
    fecha.setMinutes(parseInt(minutos, 10));
    fecha.setSeconds(0);

    const payload = {
      ...formValues,  
      FECHA_HORA: fecha.toISOString().slice(0, 19).replace('T', ' '),   
      FECHA: undefined,   
      HORA: undefined     
    };
    
    return payload;
  }

  onSave(): void {
    this.conferenceForm.markAllAsTouched();
    if (this.conferenceForm.invalid) {
      this.errorMessage = 'Por favor, completa los campos requeridos.';
      return;
    }
    this.errorMessage = null;

    const payload = this.prepareSaveData();

    if (this.isEditMode && this.currentConferenceId) {
      this.conferenceService.updateConference(this.currentConferenceId, payload).subscribe({
        next: (response: any) => {
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Error al actualizar conferencia:', err);
          this.errorMessage = 'Error al actualizar la conferencia.';
        }
      });
    } else {
      this.conferenceService.createConference(payload).subscribe({
        next: (response: any) => {
          this.dialogRef.close('saved');
        },
        error: (err: any) => {
          console.error('Error al crear conferencia:', err);
          this.errorMessage = 'Error al guardar la conferencia.';
        }
      });
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}