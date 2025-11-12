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
  qrSecret: string | null = null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      token: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.loadQrCode();
  }

  loadQrCode(): void {
    this.http.get<{ qrImage: string , secret: string}>('http://localhost:5000/api/twofactor/setup')
      .subscribe({
        next: (res) => {this.qrCodeDataUrl = res.qrImage; 
        this.qrSecret = res.secret;},
        
        
        error: () => this.snackBar.open('Error al cargar el código QR', 'Cerrar', { duration: 3000 }),
      });
  }

  onSubmit(): void {
  if (this.form.invalid || !this.qrSecret) {
    this.snackBar.open('Falta el código secreto o el formulario es inválido', 'Cerrar', { duration: 3000 });
    return;
  }

  const body = {
    secret: this.qrSecret,             
    code: this.form.value.token         
  };

  this.http.post('http://localhost:5000/api/twofactor/enable', body)
    .subscribe({
      next: () => {
        this.snackBar.open('✅ 2FA activado correctamente', 'Cerrar', { duration: 3000 });
        setTimeout(() => window.location.href = '/auth/dashboard', 3000);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(err.error?.message || 'Código inválido', 'Cerrar', { duration: 3000 });
      },
    });
}


}
