import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CalculateService } from 'src/app/services/calculate.service';
import { FirebaseRoomService } from '../services/firebase-room.service';
import { Room } from 'src/models/room';
import { Roompass } from 'src/models/roompass';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  isPassed: boolean = null;
  roomId: string;
  room: Room;
  roomLoading = true;
  pass: string = null;

  constructor(private route: ActivatedRoute, private fbr: FirebaseRoomService, private calc: CalculateService) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.fbr.getPwdInfo(this.roomId).subscribe({
      next: (val: Roompass) => {
        if (!val.isNeedPass || this.pass !== null) {
          this.loadRoom();
          return;
        }
        this.isPassed = !val.isNeedPass;
        this.route.queryParams.subscribe({
          next: params => {
            if (params.pwd) {
              this.pass = params.pwd;
              this.loadRoom();
            }
          },
        });
      },
    });
  }

  private memberArrNotEqual(a: any[], b: any[]): boolean {
    try {
      if (a.length !== b.length) {
        return true;
      }
      let eq = false;
      a.forEach(val => {
        const found = b.find(ele => ele.id > val.id);
        if (!found) {
          eq = true;
        }
      });
    } catch {
      return true;
    }
  }

  loadRoom() {
    this.isPassed = true;
    this.fbr.getRoom(this.roomId).subscribe({
      next: (val: Room) => {
        this.roomLoading = false;
        if (!this.room) {
          this.room = val;
          return;
        }
        if (this.memberArrNotEqual(this.room.members, val.members)) {
          this.room.members = val.members;
        }
        if (!(this.room.name === val.name)) {
          this.room.name = val.name;
        }
        if (!(this.room.password === val.password)) {
          this.room.members = val.members;
        }
        if (!(this.room.extraMoney === val.extraMoney)) {
          this.room.extraMoney = val.extraMoney;
        }
      },
    });
    this.pass = null;
  }

  get roomName() {
    return this.room.name !== '' ? this.room.name : 'Untitled-' + this.roomId.slice(0, 5);
  }

  updateRoomInfo(name: string, pass: string) {
    this.pass = pass;
    this.fbr.updateRoomInfo(this.roomId, name, pass);
  }

  updateRoomExtraMo() {
    this.room.extraMoney = +this.room.extraMoney;
    this.calc.extraMoney = this.room.extraMoney;
    this.fbr.updateRoomExtraMo(this.roomId, +this.room.extraMoney);
  }

  addMember() {
    this.fbr.addMember(this.roomId);
  }
}
