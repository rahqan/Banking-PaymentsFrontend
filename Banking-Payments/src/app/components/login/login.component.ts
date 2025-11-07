// // import { Component } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { AuthService } from '../../services/auth.service';
// // import { LoginRequest, Role } from '../../models/auth.model';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule],
// //   templateUrl: './login.component.html',
// //   styleUrls: ['./login.component.css']
// // })
// // export class LoginComponent {
// //   credentials: LoginRequest = {
// //     username: '',
// //     password: '',
// //     role: Role.BankUser
// //   };
// //   errorMessage = '';
// //   loading = false;

// //   constructor(private authService: AuthService, private router: Router) {}

// //   onSubmit(): void {
// //     this.loading = true;
// //     this.errorMessage = '';

// //     this.authService.login(this.credentials).subscribe({
// //       next: () => {
// //         this.router.navigate(['/bank/dashboard']);
// //       },
// //       error: (error) => {
// //         this.errorMessage = 'Invalid credentials. Please try again.';
// //         this.loading = false;
// //       }
// //     });
// //   }
// // }
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { LoginRequest, Role } from '../../models/auth.model';
 
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   credentials: LoginRequest = {
//     username: '',
//     password: '',
//     role: Role.BankUser // Default to BankUser
//   };
 
//   errorMessage = '';
//   loading = false;
 
//   // Expose Role enum to template
//   Role = Role;
 
//   constructor(private authService: AuthService, private router: Router) {}
 
//   onSubmit(): void {
//     this.loading = true;
//     this.errorMessage = '';
 
//     this.authService.login(this.credentials).subscribe({
//       next: (response) => {
//         // Navigate based on role
//         if (response.role === Role.BankUser) {
//           this.router.navigate(['/bank/dashboard']);
//         } else if (response.role === Role.SuperAdmin) {
//           this.router.navigate(['/admin/dashboard']); // Adjust as needed
//         } else if (response.role === Role.Client) {
//           this.router.navigate(['/client/dashboard']); // Adjust as needed
//         } else {
//           this.router.navigate(['/bank/dashboard']);
//         }
//       },
//       error: (error) => {
//         this.errorMessage = error.error?.message || 'Invalid credentials or role. Please try again.';
//         this.loading = false;
//       }
//     });
//   }
 
//   getRoleName(role: Role): string {
//     switch (role) {
//       case Role.SuperAdmin:
//         return 'Super Admin';
//       case Role.BankUser:
//         return 'Bank User';
//       case Role.Client:
//         return 'Client';
//       default:
//         return 'Unknown';
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecaptchaService } from '../../services/recaptcha.service';
import { LoginRequest, Role } from '../../models/auth.model';

declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: '',
    role: Role.BankUser
  };
 
  errorMessage = '';
  loading = false;
  recaptchaLoaded = false;
  
  // Expose Role enum to template
  Role = Role;
 
  constructor(
    private authService: AuthService, 
    private recaptchaService: RecaptchaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecaptchaScript();
  }

  private loadRecaptchaScript(): void {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.recaptchaLoaded = true;
    };
    document.head.appendChild(script);
  }
 
  async onSubmit(): Promise<void> {
    if (!this.recaptchaLoaded) {
      this.errorMessage = 'Please wait for reCAPTCHA to load';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Get reCAPTCHA token
      const recaptchaToken = grecaptcha.getResponse();
      
      if (!recaptchaToken) {
        this.errorMessage = 'Please complete the reCAPTCHA verification';
        this.loading = false;
        return;
      }

      // Verify reCAPTCHA with backend
      const isRecaptchaValid = await this.recaptchaService.verifyRecaptcha(recaptchaToken).toPromise();
      
      if (!isRecaptchaValid) {
        this.errorMessage = 'reCAPTCHA verification failed. Please try again.';
        grecaptcha.reset();
        this.loading = false;
        return;
      }

      // Proceed with login
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          // Navigate based on role
          if (response.role === Role.BankUser) {
            this.router.navigate(['/bank/dashboard']);
          } else if (response.role === Role.SuperAdmin) {
            this.router.navigate(['/admin/dashboard']);
          } else if (response.role === Role.Client) {
            this.router.navigate(['/client/dashboard']);
          } else {
            this.router.navigate(['/bank/dashboard']);
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Invalid credentials or role. Please try again.';
          grecaptcha.reset();
          this.loading = false;
        }
      });
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
      grecaptcha.reset();
      this.loading = false;
    }
  }
 
  getRoleName(role: Role): string {
    switch (role) {
      case Role.SuperAdmin:
        return 'Super Admin';
      case Role.BankUser:
        return 'Bank User';
      case Role.Client:
        return 'Client';
      default:
        return 'Unknown';
    }
  }
}