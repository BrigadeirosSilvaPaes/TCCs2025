import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements OnInit {
  
  public environmentInjector = inject(EnvironmentInjector);
  private router = inject(Router); 

  constructor() {
    addIcons({ triangle, ellipse, square });
  }


  ngOnInit() {
    const currentUrl = this.router.url;
    if (currentUrl === '/tabs') {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    }
  }
}