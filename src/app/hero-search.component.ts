import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  moduleId: module.id,
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ],
  providers: [HeroSearchService]
})

export class HeroSearchComponent implements  OnInit {

  heroes: Observable<Hero[]>;
/**
 * Subject, es un productor  de un stream de evento de Observable, searchTerms produce un observable de strings , el filtro de busqueda por nombre
 * Cada llamada a search, pone una nueva string  en el SUbject  llamando a next
 */
  private searchTerms = new Subject<string>();

  constructor(private heroSearchService: HeroSearchService, private router: Router){

  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
                          .debounceTime(300) //Esoera 300 ms despues de cada pulsacion antes de considerarlo un término
                          .distinctUntilChanged() // Ignora si el termino es identico al anterior
                          .switchMap(term => term // cambia a un nuevo Observable cada vez que el término cambia
                          ?this.heroSearchService.search(term) // Devuelve el observable http de la búsqueda
                          : Observable.of <Hero[]>([])) //O devuelve el observable vacío si no coinciden con el termino de búsqueda
                        .catch(error => {
                          console.log(error);
                          return Observable.of<Hero[]>([]);
                        });
  }

  gotoDetail( hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}
