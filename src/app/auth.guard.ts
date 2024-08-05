import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) =>
{

  const toastr = inject(ToastrService);
  const authService = inject(AuthService);
  const router = inject(Router)

  if (!authService.isAuthenticatedUser())
  {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
