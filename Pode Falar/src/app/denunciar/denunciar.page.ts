import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRadioGroup, IonItem, IonRadio, IonTextarea, IonButton, IonIcon, IonInput, IonCheckbox, IonLabel, IonListHeader, ToastController,AlertController,} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBWyIYSXZbbk0VEbbjQiGdWqh7R3A63YkI',
  authDomain: 'pode-falar-e95c8.firebaseapp.com',
  projectId: 'pode-falar-e95c8',
  storageBucket: 'pode-falar-e95c8.firebasestorage.app',
  messagingSenderId: '62044846473',
  appId: '1:62044846473:web:4be3217faa9e5ac2c0c958',
};

interface DenunciaData {
  nomeCompleto: string;
  nomeMae: string;
  idade: string | number;
  sexoVitima: string;
  situacao: string;
  quemEnvolvido: string;
  quemEnvolvidoDetalhado: string;
  localOcorrencia: string;
  localOcorrenciaDetalhada: string;
  ondeMora: string;
  geolocalizacaoAtual: string;
  informacoesAdicionais: string;
  timestamp: Date;
}

@Component({
  selector: 'app-denunciar',
  templateUrl: './denunciar.page.html',
  styleUrls: ['./denunciar.page.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonTitle,IonContent,IonRadioGroup,IonItem,IonRadio,IonTextarea,IonButton,IonIcon,IonInput,IonCheckbox,IonLabel,IonListHeader,CommonModule],
})
export class DenunciarPage implements OnInit {
  private db: Firestore;

  adicionarInfoExtra: boolean = false;
  especificarQuemEnvolvido: boolean = false;
  especificarLocalOcorrencia: boolean = false;
  isSubmitting: boolean = false;

  public form = {
    nomeCompleto: '',
    nomeMae: '',
    idade: '',
    sexoVitima: '',
    situacao: '',
    quemEnvolvido: '',
    quemEnvolvidoDetalhado: '',
    localOcorrencia: '',
    localOcorrenciaDetalhada: '',
    ondeMora: '',
    geolocalizacaoAtual: '',
    informacoesAdicionais: '',
  };

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  ngOnInit(): void {}

  async exibirMensagem(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  handleInfoAdicionalChange(event: CustomEvent): void {
    const value = event.detail.value;
    this.adicionarInfoExtra = value === 'sim';
  }

  handleQuemEnvolvidoChange(event: CustomEvent): void {
    const value = event.detail.value;
    this.especificarQuemEnvolvido = value === 'especificar';
  }

  handleLocalOcorrenciaChange(event: CustomEvent): void {
    const value = event.detail.value;
    this.especificarLocalOcorrencia = value === 'especificar-local';
  }

  detectarLocalizacao(): void {
    const textArea = document.getElementById(
      'geolocalizacao-atual'
    ) as HTMLIonTextareaElement;
    if (!textArea) return;

    textArea.value = 'Detectando sua localização...';
    this.exibirMensagem('Detectando sua localização...', 'tertiary');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition): Promise<void> => {
          const latitude: number = position.coords.latitude;
          const longitude: number = position.coords.longitude;
          const output = `Latitude: ${latitude}\nLongitude: ${longitude}`;

          textArea.value = output;
          this.form.geolocalizacaoAtual = output;
          this.exibirMensagem(
            'Localização (Lat/Lon) obtida com sucesso!',
            'success'
          );
        },
        (error: GeolocationPositionError): void => {
          console.error('Erro na geolocalização:', error);
          textArea.value = '';
          let errorMessage: string =
            'Não foi possível detectar a localização. Permissão negada ou tempo limite.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                'Permissão negada. Ative a permissão de localização nas configurações.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite excedido. Tente novamente.';
              break;
          }
          this.exibirMensagem(errorMessage, 'warning');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      textArea.value = '';
      this.exibirMensagem(
        'Geolocalização não é suportada por este dispositivo/navegador.',
        'warning'
      );
    }
  }

  getRadioValue(groupId: string): string {
    const radioGroup = document.getElementById(
      groupId
    ) as HTMLIonRadioGroupElement;
    return radioGroup ? (radioGroup.value as string) : 'N/A';
  }

  private async salvarDenuncia(dados: DenunciaData): Promise<void> {
    try {
      await addDoc(collection(this.db, 'denuncias'), dados);
      await this.exibirMensagem(
        'Denúncia enviada com sucesso! Obrigado.',
        'success'
      );
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
      await this.exibirMensagem(
        'Erro ao enviar denúncia. Por favor, tente novamente.',
        'danger'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  async mostrarAlertaConfirmacao(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Revisar Informações',
      message:
        'Agradecemos por sua coragem. Por favor, revise as informações com calma antes de enviar. A localização é muito importante para nos ajudar a agir.',
      buttons: [
        {
          text: 'Voltar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Enviar Denúncia',
          cssClass: 'alert-button-submit',
          handler: async () => {
            const dadosDenuncia: DenunciaData = {
              nomeCompleto: this.form.nomeCompleto,
              nomeMae: this.form.nomeMae,
              idade: this.form.idade,
              sexoVitima:
                this.form.sexoVitima === 'N/A'
                  ? 'Não informado'
                  : this.form.sexoVitima,
              situacao: this.form.situacao,
              quemEnvolvido: this.form.quemEnvolvido,
              quemEnvolvidoDetalhado: this.form.quemEnvolvidoDetalhado,
              localOcorrencia: this.form.localOcorrencia,
              localOcorrenciaDetalhada: this.form.localOcorrenciaDetalhada,
              ondeMora: this.form.ondeMora,
              geolocalizacaoAtual: this.form.geolocalizacaoAtual,
              informacoesAdicionais: this.form.informacoesAdicionais,
              timestamp: new Date(),
            };
            await this.salvarDenuncia(dadosDenuncia);
          },
        },
      ],
    });
    await alert.present();
  }

  async enviarDenuncia(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    
    const nomeInput = document.getElementById(
      'input-nome-completo'
    ) as HTMLIonInputElement | null;
    const maeInput = document.getElementById(
      'input-nome-mae'
    ) as HTMLIonInputElement | null;
    const idadeInput = document.getElementById(
      'input-idade'
    ) as HTMLIonInputElement | null;

    
    this.form.nomeCompleto = String(nomeInput?.value ?? 'N/A');
this.form.nomeMae = String(maeInput?.value ?? 'N/A');
this.form.idade = String(idadeInput?.value ?? 'N/A');


    this.form.ondeMora =
      (document.getElementById('onde-mora-denuncia') as HTMLIonTextareaElement)
        ?.value ?? 'N/A';
    this.form.geolocalizacaoAtual =
      (document.getElementById('geolocalizacao-atual') as HTMLIonTextareaElement)
        ?.value ?? 'N/A';

    this.form.sexoVitima = this.getRadioValue('radio-sexo');
    this.form.quemEnvolvido = this.getRadioValue('radio-quem-envolvido');
    this.form.localOcorrencia = this.getRadioValue('radio-local-ocorrencia');
    this.form.situacao =
      (document.getElementById('textarea-situacao') as HTMLIonTextareaElement)
        ?.value ?? 'N/A';

    
    this.form.quemEnvolvidoDetalhado =
      this.form.quemEnvolvido === 'especificar'
        ? (document.getElementById(
            'textarea-quem-envolvido-extra'
          ) as HTMLIonTextareaElement)?.value ?? 'N/A'
        : 'N/A';

    this.form.localOcorrenciaDetalhada =
      this.form.localOcorrencia === 'especificar-local'
        ? (document.getElementById(
            'localizacao-detalhada-denuncia'
          ) as HTMLIonTextareaElement)?.value ?? 'N/A'
        : 'N/A';

    const infoAdicionalSimNao = this.getRadioValue('radio-info-adicional');
    this.form.informacoesAdicionais =
      infoAdicionalSimNao === 'sim'
        ? (document.getElementById('textarea-info-extra') as HTMLIonTextareaElement)
            ?.value ?? 'N/A'
        : 'N/A';

    
    if (
      this.form.nomeCompleto === 'N/A' ||
      this.form.nomeMae === 'N/A' ||
      this.form.idade === 'N/A' ||
      this.form.sexoVitima === 'N/A' ||
      this.form.ondeMora === 'N/A' ||
      this.form.situacao === 'N/A' ||
      this.form.quemEnvolvido === 'N/A' ||
      this.form.localOcorrencia === 'N/A'
    ) {
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'danger');
      this.isSubmitting = false;
      return;
    }

    await this.mostrarAlertaConfirmacao();
  }
}
