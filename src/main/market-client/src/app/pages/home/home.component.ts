import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private websocketService: WebsocketService, private notifier: NotifierService) { }

  ngOnInit(): void {

    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });

    this.websocketService.initWebSocket().then(() => {
      this.websocketService.subscribe("/topic/notification", (event) => {
        console.log(event.body);
        const payload = (event.body as unknown as { payload: string }).payload;
        if (Notification.permission == "granted") {
          new Notification("A new product has been created", { body: payload });
        } else {
          this.notifier.notify('info', payload);
        }
      });
    });
  }




}
