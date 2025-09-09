import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/services/login/login.service';
import { Router } from '@angular/router';   // ✅ import Router

@Component({
    standalone: true,
  selector: 'app-loginpage',
  imports: [FormsModule],
  templateUrl: './loginpage.html',
  styleUrls: ['./loginpage.css'],
})
export class Loginpage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private loginService: LoginService,
     private router: Router   // ✅ inject router here
  ) {}
login() {
  if (!this.username.trim() || !this.password.trim()) {
    alert('Username or password is empty!');
    return;
  }

  this.loginService.PostLoginData({
    username: this.username,
    password: this.password,
  })
  .subscribe({
next: (res) => {
  console.log('Login successful:', res);
  localStorage.setItem('user', JSON.stringify(res)); // Save all user info
  // alert('Login successful!');
             // ✅ Always redirect to dashboard
          this.router.navigate(['/dashboard']);

},
    error: (err) => {
      console.error('Login error:', err);
      alert('Invalid username or password');
    }
  });
}

}
