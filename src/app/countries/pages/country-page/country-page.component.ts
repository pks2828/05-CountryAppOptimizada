import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit{

  public country?: Country; // En un determinado tiempo es nulo

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router, //Para redireccionar a otra pagina si no existe el pais
    private CountriesService:CountriesService,
  ){}

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.CountriesService.searchCountryByAlphaCode( id ) ) //switchMap cambia el Observable original al buscar un país según su código alfa.
    )
    .subscribe( country => { // Esto es un destructuring de un objeto que viene desde countries-routing-module, tambien es un obsrvable por que nos estamos suscribiendo
      if(! country) this.router.navigateByUrl(''); //Si no existe el pais redirecciona a la pagina principal, METODO DEL ROUTER
      return this.country = country!;
    });
  }





}
