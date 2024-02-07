import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styles: ``
})
//Mostrar los paises por capital mediante la solicitud http. 2do paso
export class ByCapitalPageComponent implements OnInit {

  public countries: Country[] = [];//Con esto mostramos el arreglo de paises vacío en principio y luego se llena con la respuesta de la solicitud http
  public isLoading: boolean = false;
  public initialValue: string = ''; //Para dejar el valor inicial del input 2do paso, los otros estan en el search-box y en cada uno de los componentes paginas

  constructor( private CountriesService: CountriesService ){}

  ngOnInit(): void {
    this.countries = this.CountriesService.cacheStore.byCapital.countries;
    this.initialValue = this.CountriesService.cacheStore.byCapital.term;
  }

  searchByCapital( term: string ):void {

    this.isLoading = true;

    this.CountriesService.searchCapital( term )
    .subscribe( countries => {
      this.countries = countries;
      this.isLoading = false;
    });

  }

}
