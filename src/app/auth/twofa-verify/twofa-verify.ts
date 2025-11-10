import { Component } from '@angular/core';
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
      token: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.http.post('http://localhost:5000/api/2fa/verify', this.form.value)
      .subscribe({
        next: () => {
          this.snackBar.open('✅ Verificación correcta', 'Cerrar', { duration: 3000 });
          setTimeout(() => window.location.href = '/dashboard', 3000);
        },
        error: () => this.snackBar.open('Código incorrecto o expirado', 'Cerrar', { duration: 3000 }),
      });
  }
}
