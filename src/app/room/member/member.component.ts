import { Component, Input, OnInit } from '@angular/core';

import { CalculateService } from 'src/app/services/calculate.service';
import { FirebaseMemberService } from 'src/app/services/firebase-member.service';
import { Member } from 'src/models/member';
import { Record } from 'src/models/record';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
  member: Member;
  mustPay: number;

  constructor(private fbm: FirebaseMemberService, private calc: CalculateService) {}

  ngOnInit() {}

  @Input()
  set memberID(id: string) {
    this.fbm.getMember(id).subscribe({
      next: (val: Member) => {
        this.member = { id, ...val };
        this.calc.addMember(this.member);
      },
    });
  }

  memberNameUpdate() {
    this.fbm.updateMemberName(this.member.id, this.member.name);
  }

  toggleChange(event) {
    this.member.noChange = event.checked;
    this.fbm.updateMemberChange(this.member.id, event.checked);
  }

  addRec() {
    this.fbm.addRecord(this.member.id, this.member.roomId);
  }

  delMem() {
    this.calc.delMember(this.member.id);
    try {
      this.member.records.forEach(element => {
        this.calc.delRecord(element.id);
      });
    } catch (e) {}
    this.fbm.delMember(this.member.id, this.member.roomId);
  }
}
