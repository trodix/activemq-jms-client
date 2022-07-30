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
    this.websocketService.initWebSocket().then(() => {
      this.websocketService.subscribe("/topic/notification", (event) => {
        console.log(event.body);
        this.notifier.notify('success', (event.body as unknown as {payload: string}).payload);
      });
    });
  }




}
