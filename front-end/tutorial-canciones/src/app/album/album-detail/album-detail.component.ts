import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/usuario/usuario';
import { Album } from '../album';
import { AlbumService } from '../album.service';

declare var $: any;

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  
  userId: number;
  token: string;
  albumId: number;
  album: Album;
  shareAlbumOn:boolean

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private albumService: AlbumService,
    private toastr: ToastrService,
  ) {
    this.shareAlbumOn = false
  }

  indiceSeleccionado: number
  applicationUsers: Usuario[]

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
    this.albumId = parseInt(this.router.snapshot.params.albumId)
    this.albumService.getAlbum(this.albumId,this.userId,this.token).subscribe(album => {
      this.album = album
      this.shareAlbumOn=false
    })
    this.getUsers()
  }

  goBack(){
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
  }

  goToEdit(){
    this.routerPath.navigate([`/albumes/edit/${this.album.id}/${this.userId}/${this.token}`])
  }

  goToJoinCancion(){
    this.routerPath.navigate([`/albumes/join/${this.album.id}/${this.userId}/${this.token}`])
  }

  goToShareAlbum(){
    //Logica para arbir modal o ir a vista
    console.log('Agregar Lógica')
  }

  onSelect(a: Album, index: number){
    console.log(a,index)
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}/${a.id}`])
  }

  goToCommentsAlbum(){
    console.log('Logic to go to comments')
  }

  goToCommentsCancion(){
    console.log('Logic to go to comments')
  }

  goToDeleteSong(){
    console.log('Logic to delete Song')
  }

  eliminarAlbum(){
    this.albumService.eliminarAlbum(this.userId, this.token, this.album.id)
    .subscribe(album => {
      this.ngOnInit();
      this.showSuccess();
      this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
    },
    error=> {
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
    this.ngOnInit()
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, "Eliminado exitosamente");
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  getUsers() {
    this.albumService.getUsers(this.token).subscribe(users => {
      console.log(users)
    this.applicationUsers = users
    },error => {
      this.showError("Ha ocurrido un error, " + error.message)
    })
  }

  getAlbumUser(id: number ): string{
    const user = this.applicationUsers.find(user => user.id === id)
    if(user)
    return user?.nombre
    else return ""
  }

  changeShareAlbum()
  {
    this.shareAlbumOn = !this.shareAlbumOn
  }

  reloadComponent()
  {
    $('#myModal').modal('hide')
    this.shareAlbumOn = !this.shareAlbumOn
    this.ngOnInit()
  }

  startModal()
  {
    $('#myModal').modal('show')
  }


}
