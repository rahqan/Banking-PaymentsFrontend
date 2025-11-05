import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); 

//  const token = localStorage.getItem('token');
// if(token){
// const payload = JSON.parse(atob(token.split('.')[1]));
// console.log('Issuer:', payload.iss);    // Should be https://localhost:7234
// console.log('Audience:', payload.aud);  // Should be https://localhost:7234
// }


  if (token) {

   
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
