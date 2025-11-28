import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,IonContent,IonButton,IonIcon]
})
export class Tab2Page {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private ngZone: NgZone
  ) {}

  async ativarCamuflagem() {
    const { value } = await Preferences.get({ key: 'camuflagemAtiva' });
    const camuflagemAtiva = value === 'true';

    const alert = await this.alertController.create({
      header: camuflagemAtiva ? 'Desativar Camuflagem' : 'Ativar Camuflagem',
      message: camuflagemAtiva
        ? 'Deseja desativar a camuflagem?'
        : 'Deseja ativar a camuflagem? O app passará a iniciar no modo de anotação (senha 100 nas configurações).',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sim',
          handler: async () => {
            this.ngZone.run(async () => {
              if (camuflagemAtiva) {
                await Preferences.set({ key: 'camuflagemAtiva', value: 'false' });
                this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
              } else {
                await Preferences.set({ key: 'camuflagemAtiva', value: 'true' });
                this.router.navigateByUrl('/home', { replaceUrl: true });
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async avisodedenuncia() {
    const alert = await this.alertController.create({
      header: 'Precisa de ajuda agora?',
      message:
        'O aplicativo ainda não oferece a opção de denúncia por telefone, pois no momento não há estrutura adequada para esse tipo de atendimento. Em casos urgentes ou de necessidade imediata, entre em contato com a polícia pelo número 190.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  goToDenunciaPage() {
    this.ngZone.run(() => {
      this.router.navigate(['/denunciar']).then(() => {
        setTimeout(async () => {
          const alert = await this.alertController.create({
            header: 'Atenção',
            message: 
                    'Violência sexual é quando alguém faz, fala ou mostra algo de cunho sexual, tenta tocar partes íntimas, pede fotos, faz comentários ou pede segredo sobre isso.\n\n' +
                    'As informações enviadas nesta seção são tratadas com total confidencialidade.Por favor, revise tudo com calma antes de enviar.',
            buttons: [
              {
                text: 'Entendido',
              },
            ],
          });
          await alert.present();
        },);
      });
    });
  }
}
