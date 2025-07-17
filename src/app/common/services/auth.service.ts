import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  AuthResponse,
  SignupRequest,
  SigninRequest,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  public user = this.userSignal.asReadonly();
  public token = this.tokenSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public isAuthenticated = computed(() => !!this.tokenSignal());

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadUserFromStorage();
  }

  signup(signupData: SignupRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/v1/auth/signup`, signupData)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.isLoadingSignal.set(false);
          return throwError(() => error);
        })
      );
  }

  signin(signinData: SigninRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/v1/auth/signin`, signinData)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.isLoadingSignal.set(false);
          return throwError(() => error);
        })
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.userSignal.set(response.user);
    this.tokenSignal.set(response.token);
    this.isLoadingSignal.set(false);

    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      this.userSignal.set(JSON.parse(user));
      this.tokenSignal.set(token);
    }
  }

  logout(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.isLoadingSignal.set(false);

    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  get currentUser(): User | null {
    return this.userSignal();
  }

  get currentToken(): string | null {
    return this.tokenSignal();
  }

  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }
    return true;
  }
}
