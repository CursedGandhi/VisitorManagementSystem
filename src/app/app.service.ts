import { Injectable, signal } from "@angular/core";
import { type User, type userResponse } from "./app.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, firstValueFrom, map, tap } from "rxjs";
import { CookieService } from "ngx-cookie-service";
@Injectable({ providedIn: 'root' })
export class AppService
{

  private url = "http://localhost:8080/user";
  private users = signal<User[]>([]);
  private operatingUser!: User;
  newID = signal<string>('');
  private response = signal<userResponse>({
    totalElements: 0,
    totalPages: 0,
    size: 0,
    content: [],
    number: 0,
    sort: {},
    numberOfElements: 0,
    first: false,
    last: false,
    pageable: {},
    empty: false
  });
  noOfPages!: number;
  allUsers = signal<User[]>([]);
  loadedUsers = this.users.asReadonly();
  constructor(private http: HttpClient, private cookieService: CookieService)
  {
  }

  fetchUsers()
  {
    return this.http.get<User[]>(this.url + '/all').pipe(tap({
      next: (users) =>
      {
        this.allUsers.set(users)
      }
    }));
  }
  

  authCheck(email: string, password: string)
  {
    return this.http.get<User>(this.url + '/auth?email='+email+'&password='+password).pipe(tap({
      next: (operatingUser) =>
      {
        this.operatingUser = operatingUser
      }
    }));
  }

  fetchUsersByPage(n: number, sortBy: string, sortOrder: string)
  {
    return this.http.get<userResponse>(this.url + '?pageNo=' + n.toString() + '&pageSize=10&sortBy=' + sortBy + '&sortingDirection=' + sortOrder).pipe(tap({
      next: (users) =>
      {
        this.response.set(users)
        this.users.set(this.response().content)
        this.noOfPages = this.response().totalPages
      }
    }))
  }

  fetchUsersByPageAndSearchText(n: number, sortBy: string, sortOrder: string, searchText: string)
  {
    return this.http.get<userResponse>(this.url + '?pageNo=' + n.toString() + '&pageSize=10&sortBy=' + sortBy + '&sortingDirection=' + sortOrder + '&searchText=' + searchText).pipe(tap({
      next: (users) =>
      {
        this.response.set(users)
        this.users.set(this.response().content)
        this.noOfPages = this.response().totalPages
      }
    }))
  }

  getCurrUser()
  {
    return (this.operatingUser);
  }

  getUser(id: string)
  {
    return this.users().filter((user) => user.id === id)[0];
  }

  addUser(user: User)
  {
    this.users.update(prevUsers => [...prevUsers, user]);
    return this.http.post(this.url, user);
  }

  removeUser(id: string)
  {
    this.users.set(this.users().filter((user) => user.id !== id));
    return this.http.delete(`${this.url}/${id}`);

  }

  updateUser(user: User)
  {
    return this.http.put(this.url + "/" + user.id, user)
  }


  getUserID()
  {
    return this.http.get<string>(this.url + "/newID", { responseType: 'text' as 'json' }).pipe(tap({
      next: (response: string) =>
      {
        this.newID.set(response);
      }
    }))
  }

  getUserRole()
  {
    return(this.operatingUser.role); 
  }

  getOperatingUser()
  {
    const value = this.cookieService.get('user');
    this.operatingUser = JSON.parse(value);
  }
  
}