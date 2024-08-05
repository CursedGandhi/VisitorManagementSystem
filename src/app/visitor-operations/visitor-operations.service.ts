import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { type Visitor, type visitorResponse } from "../app.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, firstValueFrom, map, tap } from "rxjs";
import exportFromJSON from 'export-from-json'
@Injectable({ providedIn: 'root' })
export class VisitorOperationsService
{

  private url = "http://localhost:8080/visitor";
  private visitors = signal<Visitor[]>([]);
  private operatingVisitor!: Visitor;
  private response = signal<visitorResponse>({
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
  newID = signal<string>('');
  noOfPages!: number;
  allVisitors = signal<Visitor[]>([]);
  loadedVisitors = this.visitors.asReadonly();
  constructor(private http: HttpClient, private destroyRef: DestroyRef)
  {
  }

  fetchVisitors()
  {
    return this.http.get<Visitor[]>(this.url + '/all').pipe(tap({
      next: (visitors) =>
      {
        this.allVisitors.set(visitors)
      }
    }));
  }

  fetchVisitorsByPage(n: number, sortBy: string, sortOrder: string)
  {
    return this.http.get<visitorResponse>(this.url + '?pageNo=' + n.toString() + '&pageSize=10&sortBy=' + sortBy + '&sortingDirection=' + sortOrder).pipe(tap({
      next: (visitors) =>
      {
        this.response.set(visitors)
        this.visitors.set(this.response().content)
        this.noOfPages = this.response().totalPages
      }
    }))
  }

  fetchVisitorsByPageAndUser(user: String, n: number, sortBy: string, sortOrder: string)
  {
    return this.http.get<visitorResponse>(this.url + '/byUser?user='+user+'&pageNo=' + n.toString() + '&pageSize=10&sortBy=' + sortBy + '&sortingDirection=' + sortOrder).pipe(tap({
      next: (visitors) =>
      {
        this.response.set(visitors)
        this.visitors.set(this.response().content)
        this.noOfPages = this.response().totalPages
      }
    }))
  }

  fetchVisitorsByPageAndSearchText(n: number, sortBy: string, sortOrder: string, searchText: string)
  {
    return this.http.get<visitorResponse>(this.url + '?pageNo=' + n.toString() + '&pageSize=10&sortBy=' + sortBy + '&sortingDirection=' + sortOrder + '&searchText=' + searchText).pipe(tap({
      next: (visitors) =>
      {
        this.response.set(visitors)
        this.visitors.set(this.response().content)
        this.noOfPages = this.response().totalPages
      }
    }))
  }

  fetchVisitorsByPageAndUserAndSearchText(user: String, n: number, sortBy: string, sortOrder: string, searchText: string)
  {
    return this.http.get<visitorResponse>(this.url + '/byUser?user='+user+'&pageNo=' + n.toString() + '&pageSize=10&sortBy=' + sortBy + '&sortingDirection=' + sortOrder + '&searchText=' + searchText).pipe(tap({
      next: (visitors) =>
      {
        this.response.set(visitors)
        this.visitors.set(this.response().content)
        this.noOfPages = this.response().totalPages
      }
    }))
  }

  getVisitorID()
  {
    return this.http.get<string>(this.url + "/newID", { responseType: 'text' as 'json' }).pipe(tap({
      next: (response: string) =>
      {
        this.newID.set(response);
      }
    }))
  }

  getVisitor<Visitor>(id: string)
  {
    return this.visitors().filter((visitor) => visitor.id === id)[0];
  }

  addVisitor(visitor: Visitor)
  {
    return this.http.post(this.url, visitor);
  }

  removeVisitor(id: string)
  {
    this.visitors.set(this.visitors().filter((visitor) => visitor.id !== id));
    return this.http.delete(`${this.url}/${id}`);
  }

  updateVisitor(visitor: Visitor)
  {
    return this.http.put(this.url + "/" + visitor.id, visitor)
  }

  sortVisitor(){
    this.visitors().sort((a, b) => new Date(a.date).valueOf() -
   new Date(b.date).valueOf());
  }

  jsonToXML()
  {
    const fileName = 'data';
    const exportType = exportFromJSON.types.csv;
    let data: Visitor[];
    const subscription2 = this.fetchVisitors().subscribe({ complete: () => { 
      data = this.allVisitors();
      let csv = exportFromJSON({ data, fileName, exportType})
      return csv;
    }})
    this.destroyRef.onDestroy(() =>
    {
      subscription2.unsubscribe();
    })
  }
}