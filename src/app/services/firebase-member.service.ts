import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Member } from 'src/models/member';
import { Observable } from 'rxjs';
import { Record } from 'src/models/record';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMemberService {
  constructor(private db: AngularFirestore) {}

  getMember(id: string): Observable<Member> {
    return this.db
      .collection('members')
      .doc(id)
      .valueChanges() as Observable<Member>;
  }

  updateMemberName(id: string, name: string): void {
    this.db
      .collection('members')
      .doc(id)
      .update({ name });
  }

  updateMemberChange(id: string, noChange: boolean): void {
    this.db
      .collection('members')
      .doc(id)
      .update({ noChange });
  }

  addRecord(id: string, roomId: string): void {
    const value = this.db.collection('records').add({ name: '', roomId, memberId: id } as Record);
    value.then(val => {
      this.db
        .collection('members')
        .doc(id)
        .update({
          records: firestore.FieldValue.arrayUnion(val),
        });
    });
  }

  delMember(id: string, roomId: string): void {
    const documentRef = this.db.collection('members').doc(id).ref;
    this.db
      .collection('rooms')
      .doc(roomId)
      .update({
        members: firestore.FieldValue.arrayRemove(documentRef),
      });
  }
}
