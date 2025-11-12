import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
    this.errorMessage = '';
    const formData = this.loginForm.value;

    this.http.post('http://localhost:5000/api/auth/login', formData)
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          // Validar respuesta del backend
          if (!res || !res.token) {
            this.snackBar.open('Error: no se recibió token del servidor.', 'Cerrar', { duration: 3000 });
            return;
          }

          // Guardar token (ya sea completo o parcial)
          localStorage.setItem('token', res.token);
          console.log('🔐 Token guardado en localStorage:', res.token);

          // Mostrar notificación
          this.snackBar.open('✅ Login exitoso, redirigiendo...', 'Cerrar', { duration: 2500 });

          // Redirección según si requiere 2FA
          setTimeout(() => {
            if (res.requires2FA) {
              console.log('Usuario con 2FA activo → redirigiendo a /2fa/verify');
              this.router.navigate(['/2fa/verify']);
            } else {
              console.log('Usuario sin 2FA → redirigiendo a /dashboard');
              this.router.navigate(['/pages/dashboard']);
            }
          }, 2500);
        },
        error: (err) => {
          console.error('Error en inicio de sesión:', err);
          this.errorMessage = err.error?.message || 'Credenciales incorrectas o error en el servidor.';
          this.loading = false;
          this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
