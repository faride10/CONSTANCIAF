import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupos-selection-modal',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatListModule, 
    MatIconModule, MatFormFieldModule, MatInputModule, FormsModule
  ],
  template: `
    <div mat-dialog-title style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee;">
      <span>Seleccionar Grupos</span>
      <button mat-icon-button (click)="onClose()"><mat-icon>close</mat-icon></button>
    </div>

    <div style="padding: 10px 20px; background: #fafafa;">
      <mat-form-field appearance="outline" style="width: 100%; font-size: 14px;">
        <mat-label>Buscar grupo...</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput [(ngModel)]="searchText" (keyup)="filtrar()" placeholder="Ej. 5E">
      </mat-form-field>
    </div>

    <mat-dialog-content style="height: 400px; padding: 0;">
      <mat-selection-list #list>
        <mat-list-option *ngFor="let grupo of gruposFiltrados" 
                         [value]="grupo" 
                         [selected]="isSelected(grupo)"
                         checkboxPosition="before">
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 500;">{{ grupo.nombre }}</span>
          </div>
        </mat-list-option>
      </mat-selection-list>
    </mat-dialog-content>

    <mat-dialog-actions align="end" style="border-top: 1px solid #eee;">
      <button mat-button (click)="onClose()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="guardar(list.selectedOptions.selected)">
        Confirmar Selección
      </button>
    </mat-dialog-actions>
  `
})
export class GruposSelectionModalComponent implements OnInit {
  grupos: any[] = [];
  gruposFiltrados: any[] = [];
  seleccionadosPrevios: any[] = [];
  searchText: string = '';

  constructor(
    public dialogRef: MatDialogRef<GruposSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.grupos = data.todosLosGrupos || [];
    this.seleccionadosPrevios = data.seleccionados || [];
    this.gruposFiltrados = [...this.grupos];
  }

  ngOnInit(): void {}

  filtrar() {
    const term = this.searchText.toLowerCase();
    this.gruposFiltrados = this.grupos.filter(g => 
      g.nombre.toLowerCase().includes(term)
    );
  }

  isSelected(grupo: any): boolean {
    return this.seleccionadosPrevios.some(s => s.id_grupo === grupo.id_grupo);
  }

  guardar(opcionesSeleccionadas: any[]) {
    const valores = opcionesSeleccionadas.map(op => op.value);
    this.dialogRef.close(valores);
  }

  onClose() {
    this.dialogRef.close();
  }
}