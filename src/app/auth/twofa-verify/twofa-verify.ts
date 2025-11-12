import { Component, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-2fa-verify',
  templateUrl: './twofa-verify.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class TwoFactorVerify {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      Code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const token = localStorage.getItem('token'); // JWT parcial del login
    if (!token) {
      this.snackBar.open('No hay sesión activa', 'Cerrar', { duration: 3000 });
      return;
    }
    const body = { Code: this.form.value.Code , Secret: ''}; // Añadir el campo Secret vacío  
    this.http.post('http://localhost:5000/api/twofactor/verify', body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.snackBar.open('✅ Verificación correcta', 'Cerrar', { duration: 3000 });
          setTimeout(() => window.location.href = 'pages/dashboard', 3000);
        },
        error: (err) => {
          console.error(err);
          
          this.snackBar.open(err.error?.message || 'Código incorrecto o expirado', 'Cerrar', { duration: 3000 });
        },
      });
  }

}
