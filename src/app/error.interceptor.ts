import { HttpClient, 
    HttpHeaders,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse, 
    HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

export class HttpErrorInteceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent){
                        errorMessage = `Error: ${error.error.message}`
                    } else {
                        errorMessage = `Error Code: ${error.status} \n Message: ${error.message}`
                    }
                    window.alert(errorMessage)
                    return throwError(errorMessage);
                })
                )
    }
}