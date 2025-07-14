
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { RecipesService } from '../../services/recipes';
import { Router } from '@angular/router';
import { FormatInstructionsPipe } from '../../pipes/format-instructions.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatInstructionsPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  userProfile: any = {
    name: 'Usuario',
    email: '',
    avatar: 'assets/img/default-avatar.png'
  };
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  searchTerm: string = '';
  showProfile: boolean = false;
  selectedRecipe: any = null;
  isLoading: boolean = true;


  constructor(
    private authService: AuthService,
    private recipesService: RecipesService,
    private router: Router
  ) { }


  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }

    this.userProfile = this.authService.getCurrentUser();
    this.loadRecipes();
  }


  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userProfile = {
        name: currentUser.name || 'Usuario',
        email: currentUser.email,
        // Usamos image si existe, si no avatar, si no la imagen por defecto
        avatar: currentUser.image || currentUser.avatar || 'assets/img/default-avatar.png'
      };
    }
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipesService.getRecipes().subscribe({
      next: (data: any) => {
        this.recipes = data.meals || [];
        this.filteredRecipes = [...this.recipes];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.isLoading = false;
      }
    });
  }

  searchRecipes() {
    if (this.searchTerm.trim() === '') {
      this.filteredRecipes = [...this.recipes];
      return;
    }

    this.recipesService.searchRecipes(this.searchTerm).subscribe({
      next: (data: any) => {
        this.filteredRecipes = data.meals || [];
      }
    });
  }

  removeRecipe(index: number) {
    this.filteredRecipes.splice(index, 1);
  }

  logout() {
    this.authService.logout();
  }

  viewRecipe(recipe: any) {
    this.selectedRecipe = recipe;
  }
}