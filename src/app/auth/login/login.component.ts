import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { EmailValidatorService } from '../../shared/validators/email-validator.service';
import { Session } from 'src/app/shared/interfaces/session.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { DialogMessageService } from '../../shared/services/dialog-message.service';
import { DialogService } from '../../components/services/dialog/dialog.service';
import { DialogMessageComponent } from '../../shared/components/dialog-message/dialog-message.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(this.emailValidator.emailPattern)], [this.emailValidator]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    constructor(
        private fb: FormBuilder,
        private emailValidator: EmailValidatorService,
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        public router: Router,
        private dialogMessageService: DialogMessageService,
        private dialogService: DialogService
    ) { }

    ngOnInit(): void {
    }

    get emailErrorMsg() {
        const errors = this.loginForm.get('email')?.errors;
        if (errors?.['required']) {
            return 'Email es obligatorio';
        } else if (errors?.['pattern']) {
            return 'El texto ingresado no tiene formato de email';
        }
        return '';
    }


    submit() {
        this.loginForm.markAllAsTouched();
        if (!this.loginForm.valid) {
            return;
        }
        this.authService.login(this.loginForm.value).subscribe({
            next: (session: any) => {
                console.log('Respuesta del backend (login OK):', session);
                this.dialogMessageService.setMessage('Credenciales correctas, iniciando sesión');
                this.dialogService.openDialog({ component: DialogMessageComponent });
                // Si session es string, lo convertimos a objeto compatible
                if (typeof session === 'string') {
                    this.setSession({ email: '', id: 0, role: '' as any, token: session });
                } else {
                    this.setSession(session);
                }
            },
            error: (err) => {
                console.error('Error recibido del backend (login):', err);
                const errorMsg = err?.error?.message || 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
                this.dialogMessageService.setMessage(errorMsg);
                return this.dialogService.openDialog({ component: DialogMessageComponent });
            }
        });

    }

    setSession({ email, id, role, token }: Session) {
        if (token) {
            console.log('Token recibido correctamente:', token);
        } else {
            console.warn('No se recibió token al iniciar sesión');
        }
        this.localStorageService.setItem({ key: 'user', value: { email, id, role } });
        this.localStorageService.setItem({ key: 'token', value: token });
        this.router.navigate(['user', 'inventory']);
    }
}
