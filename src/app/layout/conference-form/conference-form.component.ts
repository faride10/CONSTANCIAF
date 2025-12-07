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
      this.currentConferenceId = conference.id_conferencia;
      
      const fechaHora = conference.fecha_hora ? new Date(conference.fecha_hora) : null;

      this.conferenceForm = this.fb.group({
        fecha: [fechaHora, Validators.required],
        hora: [fechaHora ? fechaHora.toTimeString().substring(0, 5) : null, Validators.required],
        nombre_conferencia: [conference.nombre_conferencia, Validators.required],
        tema: [conference.TEMA],
        lugar: [conference.lugar, Validators.required],
        num_participantes: [conference.num_participantes, Validators.pattern('^[0-9]*$')],
        id_ponente: [conference.id_ponente],
        grupos: [conference.grupos ? conference.grupos.map((g: any) => g.id_grupo) : []] 
      });

    } else {
      this.isEditMode = false;
      this.conferenceForm = this.fb.group({
        nombre_conferencia: ['', Validators.required],
        tea: [''],
        fecha: [null, Validators.required],
        hora: [null, Validators.required],
        lugar: ['', Validators.required],
        num_participantes: [null, Validators.pattern('^[0-9]*$')],
        id_ponente: [null],
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

    const grupoEncontrado = this.grupos.find(g => g.id_grupo === grupoId);
    const nombreGrupo = grupoEncontrado ? grupoEncontrado.NOMBRE : 'Grupo';
    const nombreConferencia = this.conferenceForm.get('nombre_conferencia')?.value;

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

    const fecha = new Date(formValues.fecha);
    
    const [horas, minutos] = formValues.hora.split(':');

    fecha.setHours(parseInt(horas, 10));
    fecha.setMinutes(parseInt(minutos, 10));
    fecha.setSeconds(0);

    const payload = {
      ...formValues,  
      fecha_hora: fecha.toISOString().slice(0, 19).replace('T', ' '),   
      fecha: undefined,   
      hora: undefined     
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