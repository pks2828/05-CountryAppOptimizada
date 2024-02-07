//Aqui se centraliza toda la logica de las peticione y cache
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';


//Mostrar los paises por capital mediante la solicitud http inyectando el servicio de httpclient. 1er paso
@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1'

  public cacheStore: CacheStore = {
    byCapital:   {term: '', countries: []},
    byCountries: {term: '', countries: []},
    byRegion:    {region: '', countries: []},
  }


  constructor(private http: HttpClient) {//Mediante esto hacemos la peticion a la API
      this.loadFromLocalStorage();// Con esto cargamos el localstorage que definimos en nuestros metodos del servicio
  }

  private saveToLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if( !localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')! );
  }

  private getCountriesRequest( url: string): Observable<Country[]> {//Metodo para optimizacion ya que se reutiliza en varios metodos
    return this.http.get<Country[]>( url )
     .pipe(
      catchError( () => of([]) ),
      // delay( 2000 ),
     );
  }

  searchCountryByAlphaCode(code:string): Observable<Country | null> {

    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>( url )
     .pipe(
      map( countries => countries.length > 0 ? countries[0] : null ), //Si hay mas de un país con ese código devuelve solo uno
      catchError( () => of(null) )
     );
  }

  searchCapital(term: string): Observable<Country[]> { //Funcion que se encarga de hacer la peticion a la API mediante el termino de busqueda en base a la interfaz
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest( url )//Optimizado
      .pipe(
        tap( countries => this.cacheStore.byCapital = {term, countries}),//1er paso para guardar el termino de busqueda y las capitales encontrados
        tap( () => this.saveToLocalStorage() ),
      );
  }

  searchCountry(term:string):Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest( url )//Optimizado
      .pipe(
        tap( countries => this.cacheStore.byCountries = {term, countries}),//1er paso para guardar el termino de busqueda y los paises encontrados
        tap( () => this.saveToLocalStorage() ),
     );

  }

  searchRegion(region:Region):Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest( url )//Optimizado
      .pipe(
        tap( countries => this.cacheStore.byRegion = {region, countries}),//1er paso para guardar el termino de busqueda y las regiones
        tap( () => this.saveToLocalStorage() ),
      );

  }

}
