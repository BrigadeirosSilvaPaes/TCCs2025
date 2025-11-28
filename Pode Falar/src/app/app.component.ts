import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular/standalone';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet *ngIf="appInicializado"></router-outlet>
  `,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appInicializado = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private zone: NgZone,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch {}

    const { value } = await Preferences.get({ key: 'camuflagemAtiva' });
    const camuflagemAtiva = value === 'true';

    App.addListener('pause', async () => {
      console.log('App foi pausado → limpando alerta');
      await Preferences.remove({ key: 'alertShown' });
    });

    this.zone.run(async () => {
      if (camuflagemAtiva) {
        console.log('Camuflagem ativa → iniciando em /home');
        await this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        console.log('Camuflagem desativada → iniciando em /tabs/tab1');
        await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      }

      await this.checkAndShowAlert();
      this.appInicializado = true;
    });
  }

  private async checkAndShowAlert() {
    const { value: alreadyShown } = await Preferences.get({ key: 'alertShown' });
    const currentRoute = this.router.url;

    if (!alreadyShown && !currentRoute.includes('/home')) {
      await this.showAlert();
      await Preferences.set({ key: 'alertShown', value: 'true' });
    }
  }

private async showAlert() {
  const alert = await this.alertController.create({
    header: 'Atenção!',
    message: 
      'O Pode Falar é um espaço de ajuda para situações de violência sexual contra crianças e adolescentes.\n\n' +
      'Violência sexual é quando alguém faz, fala ou mostra algo de cunho sexual, tenta tocar partes íntimas, pede fotos, faz comentários ou pede segredo sobre isso.\n\n' +
      'Se algo assim acontecer, fale com a gente. Você não tem culpa e merece ser protegido(a).',
    buttons: [
      {
        text: 'Entendido',
      },
    ],
  });

  await alert.present();
}
}