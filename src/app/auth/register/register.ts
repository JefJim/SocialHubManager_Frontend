import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  user = {
    username: '',
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  onRegister() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.http.post('http://localhost:5000/api/auth/register', this.user).subscribe({
      next: (res) => {
        this.snackBar.open('✅ Registro exitoso, redirigiendo automaticamente al login', 'Cerrar', { duration: 3000 });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 3000);
      },
      error: (err) => {
        this.snackBar.open('❌ Error en el registro', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }
}