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
    // 1️⃣ Simulación inicial (luego conectar al backend)
    this.user = {
      id: 1,
      name: 'Jefry',
      email: 'jefry@example.com',
      twoFactorEnabled: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...'
    };

    this.providers = [
      { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: 'blue' },
      { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter', color: 'sky' },
      { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: 'pink' }
    ];

    // 2️⃣ Llamada real al backend si existe endpoint /api/social/configs
    // this.http.get('http://localhost:5000/api/social/configs').subscribe((data: any) => {
    //   this.configs = data.configs;
    //   this.user = data.user;
    // });
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
    this.http.get(`http://localhost:5000/api/auth/config/${providerId}/instructions`)
      .subscribe({
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
}
