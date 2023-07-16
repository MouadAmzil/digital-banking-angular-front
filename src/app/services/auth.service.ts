import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode, * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  accessToken!: string;
  constructor(private http: HttpClient,private router:Router) { }
  public login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/-www-form-urlencoded")
    }
    let params = new HttpParams()
      .set("username", username).set("password", password);
    return this.http.post("http://localhost:8085/auth/login", params, options)
  }

  loadProfile(data: any) {
    this.isAuthenticated = true;
    this.accessToken! = data['access-token'];
    let decodedJwt: any = jwtDecode(this.accessToken);
    this.username = decodedJwt.sub;
    this.roles = decodedJwt.scope;
    window.localStorage.setItem("jwt-stockage", this.accessToken)
  }

  logout() {
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.username = undefined;
    this.roles = undefined;
    this.router.navigateByUrl("/login")
    window.localStorage.removeItem("jwt-stockage")

  }

  localJwttokenFromLocatStroge() {
    let token = window.localStorage.getItem("jwt-stockage");
    if (token) {
      this.loadProfile({"access-token":token});
      this.router.navigateByUrl("/admin/customers")
    }

  }

}
