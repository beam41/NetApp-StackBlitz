import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { NgModule } from '@angular/core';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'new', component: NewRoomComponent },
  { path: 'room/:roomId', component: RoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
