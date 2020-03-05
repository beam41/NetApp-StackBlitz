import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Record } from 'src/models/record';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseRecordService {
  constructor(private db: AngularFirestore) {}

  getRecord(id: string): Observable<Record> {
    return this.db
      .collection('records')
      .doc(id)
      .valueChanges() as Observable<Record>;
  }

  updateRecordName(id: string, name: string): void {
    this.db
      .collection('records')
      .doc(id)
      .update({ name });
  }

  updateRecordAmount(id: string, amount: number): void {
    this.db
      .collection('records')
      .doc(id)
      .update({ amount });
  }

  updateRecordIsDonation(id: string, isDonation: boolean): void {
    this.db
      .collection('records')
      .doc(id)
      .update({ isDonation });
  }

  delRecord(id: string, memberId: string): void {
    const documentRef = this.db.collection('records').doc(id).ref;
    this.db
      .collection('members')
      .doc(memberId)
      .update({
        records: firestore.FieldValue.arrayRemove(documentRef),
      });
  }
}
