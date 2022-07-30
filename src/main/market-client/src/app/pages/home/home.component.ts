import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.websocketService.initWebSocket().then(() => {
      this.websocketService.subscribe("/topic/notification", (event) => {
        console.log(event.body);
      });
    });
  }




}
