import {ComponentDirective} from 'templating';
import {AppRouter} from 'router';

@ComponentDirective
export class App {
  constructor(router:AppRouter) {
    this.router = router;
    this.router.configure((config)=>{
      config.title = 'Angular Issues';

      config.map([
        { pattern: ['','issues'], componentUrl: 'routes/overview', title:'Issues' },
        { pattern: 'issues/:id',  componentUrl: 'routes/detail' }
      ]);
    });
  }
}