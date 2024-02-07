import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent implements OnInit {

  //propiedades para el manejo de la solicitud http y los resultados obtenidos
  public countries: Country[] = [];//Con esto mostramos el arreglo de paises vacío en principio y luego se llena con la respuesta de la solicitud http
  public isLoading: boolean = false;
  public initialValue: string = ''; //Para dejar el valor inicial del input 2do paso, los otros estan en el search-box y en cada uno de los componentes paginas


  constructor(private CountriesService: CountriesService){}

  ngOnInit(): void {
    this.countries = this.CountriesService.cacheStore.byCountries.countries;
    this.initialValue = this.CountriesService.cacheStore.byCountries.term;//Esto lo mandamos al html country
  }

  searchByCountry(term:string):void {

    this.isLoading = true;

    this.CountriesService.searchCountry(term)
      .subscribe(countries => {
        this.countries = countries;
        this.isLoading = false;
      });
  }

}
