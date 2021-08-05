import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(first_name, last_name, email, password, retype_password) {
    let url = encodeURI(`${environment.apis.v1}/accounts/auth/signup`);

    return this.http.post(url, {
      first_name: first_name, last_name: last_name, email: email,
      password: password, retype_password: retype_password
    });
  }
}
