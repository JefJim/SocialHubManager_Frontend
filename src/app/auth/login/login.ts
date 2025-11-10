import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Register } from '../register/register';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = ''; // Limpiar errores previos
    const formData = this.loginForm.value;

    this.http.post('http://localhost:5000/api/auth/login', formData)
      .subscribe({
        next: (res: any) => {
          this.snackBar.open('✅ Login exitoso, redirigiendo automaticamente al dashboard', 'Cerrar', { duration: 3000 });
          setTimeout(() => {
            window.location.href = '/pages/dashboard';
          }, 3000);
        },
        error: (err) => {
          console.error('Error en inicio de sesión:', err);
          this.errorMessage = err.error?.message || 'Credenciales incorrectas o error en el servidor.';
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
