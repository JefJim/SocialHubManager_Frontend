import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  twoFactorEnabled: boolean;
  avatar?: string;
}

interface ProviderConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  isVerified?: boolean;
  displayName?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  user: User | null = null;
  providers: ProviderConfig[] = [];
  configs: Record<string, any> = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Si no hay token, redirigir al login
    const token = localStorage.getItem('token');
    console.log('Token en dashboard: ', token);
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Obtener información del usuario (el interceptor añade el token automáticamente)
    this.http.get<User>('http://localhost:5000/api/auth/me').subscribe({
      next: (res) => {
        this.user = res;
        console.log('Usuario cargado:', this.user);

        // Cargar redes sociales conectadas
        this.loadSocialConfigs();
      },
      error: (err) => {
        console.error('Error al obtener info del usuario', err);
        this.router.navigate(['/auth/login']);
      }
    });

    // Definir proveedores disponibles
    this.providers = [
      { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: 'blue' },
      { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter', color: 'sky' },
      { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: 'pink' }
    ];
  }

  loadSocialConfigs() {
    this.http.get<any>('http://localhost:5000/api/social/configs').subscribe({
      next: (res) => {
        this.configs = {};
        res.configs.forEach((item: any) => {
          this.configs[item.provider] = {
            isVerified: true,
            displayName: item.displayName || ''
          };
        });
      },
      error: (err) => console.error('Error al obtener redes sociales', err)
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    const menu = document.getElementById('dropdownMenu');
    if (menu) menu.classList.toggle('hidden');
  }

  closeDropdownOutside(event: MouseEvent): void {
    const menu = document.getElementById('dropdownMenu');
    const btn = document.getElementById('avatarBtn');
    if (menu && btn && !btn.contains(event.target as Node) && !menu.contains(event.target as Node)) {
      menu.classList.add('hidden');
    }
  }

  showInstructions(providerId: string): void {
    this.http.get(`http://localhost:5000/api/auth/config/${providerId}/instructions`).subscribe({
      next: (res: any) => {
        const modal = document.getElementById('instructionsModal');
        const title = document.getElementById('instructionsTitle');
        const content = document.getElementById('instructionsContent');

        if (title && content && modal) {
          title.textContent = res.instructions.title;
          content.innerHTML = `
            <p class="text-gray-300 mb-4">${res.instructions.description}</p>
            <ol class="list-decimal list-inside space-y-2">
              ${res.instructions.steps.map((s: string) => `<li>${s}</li>`).join('')}
            </ol>
          `;
          modal.classList.remove('hidden');
        }
      },
      error: (err) => console.error('Error al cargar instrucciones', err)
    });
  }

  closeInstructions(): void {
    document.getElementById('instructionsModal')?.classList.add('hidden');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  goTo2FA(): void {
    if (!this.user) return;

    if (this.user.twoFactorEnabled) {
      alert('Ya tienes la autenticación 2FA activada.');
      
    } else {
      this.router.navigate(['/2fa/setup']);
    }
  }
}
