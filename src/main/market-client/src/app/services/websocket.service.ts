import { Injectable } from "@angular/core";
import * as SockJS from 'sockjs-client'
import * as Stomp from 'webstomp-client';
import { SERVER_API_URL } from "../../app.constants";

@Injectable()
export class WebsocketService {

  private serverUrl = `${SERVER_API_URL}/socket`;
  private stompClient: Stomp.Client | null = null;
  public mapEndpointSubscription: Map<string, any> = new Map();

  public async initWebSocket() {
    return new Promise((resolve) => {
      if (!this.stompClient) {
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        this.stompClient.connect({}, resolve);
      } else {
        resolve(undefined);
      }
    })
  }

  public async subscribe(name: string, fnc: (event: Stomp.Message) => void) {
    const subscription = this.stompClient?.subscribe(`${name}`, (event) => {
      fnc({ ...event, body: JSON.parse(event.body) })
    });
    this.mapEndpointSubscription.set(name, subscription);
  }

  public unsubscribeToWebSocketEvent(name: string) {
    const subscription = this.mapEndpointSubscription.get(name);
    if (subscription) {
      subscription.unsubscribe();
    }
  }


  public send(name: string, body: any) {
    this.stompClient?.send(`/app/topic/${name}`, JSON.stringify(body));
  }

  public disconnect() {
    if (this.stompClient !== null) {
      this.stompClient?.disconnect(() => { /* do something */ });
    }
  }


}
