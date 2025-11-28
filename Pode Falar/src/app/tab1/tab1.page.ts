import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab1Page implements ViewWillEnter { 
  
  openSegments: { [key: string]: boolean } = {};

  constructor(private cdr: ChangeDetectorRef) {} 

  ionViewWillEnter() {
    this.openSegments = {};
    this.cdr.detectChanges(); 
  }

  toggleSegment(segmentName: string) {
    this.openSegments[segmentName] = !this.openSegments[segmentName];
    
    this.cdr.detectChanges(); 
  }
}