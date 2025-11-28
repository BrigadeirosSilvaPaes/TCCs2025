import { Component, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonFab, IonFabButton, IonSearchbar, IonInput, IonModal, IonButtons, IonTextarea} from '@ionic/angular/standalone';
import { add, trash, cog } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,FormsModule,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,IonButton, IonIcon, IonFab, IonFabButton, IonSearchbar, IonInput, IonModal,IonButtons, IonTextarea],
})
export class HomePage {
  @ViewChild('settingsModal') settingsModal!: IonModal;

  notes: { id: number; text: string; }[] = [];
  filteredNotes: { id: number; text: string; }[] = [];
  isModalOpen = false;
  isSettingsModalOpen = false;
  newNoteText: string = '';
  searchTerm: string = '';
  feedbackText: string = '';

  constructor(private router: Router, private ngZone: NgZone) {
    addIcons({ add, trash, cog });
  }

  ionViewWillEnter() {
    this.loadNotes();
  }

  loadNotes() {
    this.notes = [];
    this.filteredNotes = [];
  }

  openAddModal(isOpen: boolean) {
    this.ngZone.run(() => {
      this.isModalOpen = isOpen;
      this.newNoteText = '';
    });
  }

  openSettingsModal(isOpen: boolean) {
    this.ngZone.run(() => {
      this.isSettingsModalOpen = isOpen;
    });
  }

  sendFeedback() {
    this.ngZone.run(() => { 
      if (this.feedbackText === '100') {
        this.isSettingsModalOpen = false;
        this.settingsModal.dismiss();
        this.router.navigate(['/tabs']);
      } else {
        this.feedbackText = '';
      }
    });
  }

  addNote() {
    this.ngZone.run(() => {
      if (this.newNoteText.trim() !== '') {
        const newId = this.notes.length > 0 ? Math.max(...this.notes.map(n => n.id)) + 1 : 1;
        this.notes.push({ id: newId, text: this.newNoteText });
        this.newNoteText = '';
        this.openAddModal(false);
        this.filterNotes();
      }
    });
  }

  deleteNote(id: number) {
    this.ngZone.run(() => { 
      this.notes = this.notes.filter(note => note.id !== id);
      this.filterNotes();
    });
  }

  filterNotes() {
    this.ngZone.run(() => {
      if (this.searchTerm.trim() === '') {
        this.filteredNotes = [...this.notes];
      } else {
        this.filteredNotes = this.notes.filter(note =>
          note.text.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    });
  }
}











         