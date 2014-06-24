import {ComponentDirective} from 'templating';
import {GhService} from 'services';

@ComponentDirective({selector:'events'})
export class Events {
  constructor(service:GhService) {
    this.service = service;
  }

  activate(params){
    return this.service.events(params.$parent.id).then((events) =>{
      this.events = events;
    });
  }
}