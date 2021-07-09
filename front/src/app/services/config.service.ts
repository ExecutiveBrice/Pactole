import { Injectable } from '@angular/core';


@Injectable()
export class ConfigService {


  constructor(

  ) { }

  signOut() {
    localStorage.clear();
  }

  public removeItem(itemName: string) {
    localStorage.removeItem(itemName);
  }

  public saveItem(itemName: string, object: any) {
    localStorage.setItem(itemName, JSON.stringify(object));
  }

  public getItem(itemName: string): any {


    return JSON.parse(localStorage.getItem(itemName));
  }



  public removeMessage(itemName: string) {
    localStorage.removeItem(itemName);
  }

  public saveMessage(itemName: string, object: Map<string, string>) {


    let stringifiedObject = ""

    object.forEach((value: string, key: string) => {

      stringifiedObject = stringifiedObject + "" + key + "___" + value + "+++"
    })
    stringifiedObject = stringifiedObject.substring(0, stringifiedObject.length - 3)
    stringifiedObject = stringifiedObject + ""

    localStorage.setItem(itemName, stringifiedObject);
  }

  public getMessages(itemName: string): Map<string, string> {


    let messages: Map<string, string> = new Map();
    if (localStorage.getItem(itemName) != null) {
      let messagesSplited = localStorage.getItem(itemName).split("+++")
      messagesSplited.forEach(string => {
        let messageSplited = string.split("___")
        if (messageSplited[0].length > 0) {
          messages.set(messageSplited[0], messageSplited[1])
        }
      })

    }

    return messages;
  }

}
