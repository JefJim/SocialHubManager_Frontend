import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  onRegister() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    // Aquí conectas con tu backend (ajusta el endpoint)
    this.http.post('http://localhost:5000/api/auth/register', this.user).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.errorMessage = '';
        alert('Registro exitoso ✅');
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage = 'No se pudo registrar el usuario';
      }
    });
  }
}