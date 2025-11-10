import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { C } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-2fa-setup',
  templateUrl: './twofa-setup.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class TwoFactorSetup implements OnInit {
  form!: FormGroup;
  qrCodeDataUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      token: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.loadQrCode();
  }

  loadQrCode(): void {
    this.http.get<{ qrCodeDataURL: string }>('http://localhost:5000/api/2fa/setup')
      .subscribe({
        next: (res) => this.qrCodeDataUrl = res.qrCodeDataURL,
        error: () => this.snackBar.open('Error al cargar el código QR', 'Cerrar', { duration: 3000 }),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.http.post('http://localhost:5000/api/2fa/activate', this.form.value)
      .subscribe({
        next: () => {
          this.snackBar.open('✅ 2FA activado correctamente', 'Cerrar', { duration: 3000 });
          setTimeout(() => window.location.href = '/auth/login', 3000);
        },
        error: () => this.snackBar.open('Código inválido', 'Cerrar', { duration: 3000 }),
      });
  }
}
