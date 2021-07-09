import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class MessageService {

  constructor(
    private configService: ConfigService
  ) { }

  // Observable string sources
  private messages_transfert = new Subject<Map<string, string>>();

  // Observable string streams
  dataStream = this.messages_transfert.asObservable();

  // Service message commands
  dataTransmission(messages: Map<string, string>) {

    this.messages_transfert.next(messages);
  }



  /**
   * Gestion d'affichage des messages
   */
  messages: Map<string, string> = new Map();
  addMessage(clef: string, message: string) {
    if (!this.messages.has(clef)) {
      this.messages.set(clef, message)
    }

    this.dataTransmission(this.messages)
  }

  deleteMessage(clef) {
    this.messages.delete(clef);
    this.dataTransmission(this.messages)
  }



  /**
   * Gestion d'affichage des messages
   */

  addRedMessage(clef: string, message: string) {
    let messagesRed: Map<string, string>
    if (this.configService.getMessages("Red_messages") == null) {
      messagesRed = new Map();
    } else {
      messagesRed = this.configService.getMessages("Red_messages")
    }
    if (messagesRed.has(clef)) {
      messagesRed.delete(clef);
    }
    messagesRed.set(clef, message)

    this.configService.removeMessage("Red_messages")
    this.configService.saveMessage("Red_messages", messagesRed)
  }

  deleteRedMessage(clef: string) {
    let messagesRed: Map<string, string>
    if (this.configService.getMessages("Red_messages") == null) {
      messagesRed = new Map();
    } else {
      messagesRed = this.configService.getMessages("Red_messages")
    }
    messagesRed.delete(clef);
    this.configService.removeMessage("Red_messages")
    this.configService.saveMessage("Red_messages", messagesRed)
  }

  getRedMessages() {
    let messagesRed: Map<string, string>
    if (this.configService.getMessages("Red_messages") == null) {
      messagesRed = new Map();
    } else {
      messagesRed = this.configService.getMessages("Red_messages")
    }
    return messagesRed;
  }











  addGreenMessage(clef: string, message: string) {
    let messagesGreen: Map<string, string>
    if (this.configService.getMessages("Green_messages") == null) {
      messagesGreen = new Map();
    } else {
      messagesGreen = this.configService.getMessages("Green_messages")
    }
    if (messagesGreen.has(clef)) {
      messagesGreen.delete(clef);
    }

    messagesGreen.set(clef, message)

    this.configService.removeMessage("Green_messages")
    this.configService.saveMessage("Green_messages", messagesGreen)
  }

  deleteGreenMessage(clef: string) {
    let messagesGreen: Map<string, string>
    if (this.configService.getMessages("Green_messages") == null) {
      messagesGreen = new Map();
    } else {
      messagesGreen = this.configService.getMessages("Green_messages")
    }
    messagesGreen.delete(clef);
    this.configService.removeMessage("Green_messages")
    this.configService.saveMessage("Green_messages", messagesGreen)
  }

  getGreenMessages() {
    let messagesGreen: Map<string, string>

    if (this.configService.getMessages("Green_messages") == null) {

      messagesGreen = new Map();
    } else {
      messagesGreen = this.configService.getMessages("Green_messages")
    }

    return messagesGreen;
  }

}
