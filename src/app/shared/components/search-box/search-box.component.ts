import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent implements OnInit, OnDestroy {//Funcionamiento del searchbox 2do paso

  private debouncer: Subject<string> = new Subject<string>();//Es un tipo de observable especial, basicamente creado manualmente
  private debouncerSuscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = ''; //Para dejar el valor inicial del input recibimos la propiedad y luego vamos al searchbox. 1er paso

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebaunce = new EventEmitter<string>();

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer
    .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        this.onDebaunce.emit( value );
      });
    }

    ngOnDestroy(): void {
      this.debouncerSuscription?.unsubscribe();
    }

    emitValue(value:string):void {
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string){
    this.debouncer.next(searchTerm);
  }

}
