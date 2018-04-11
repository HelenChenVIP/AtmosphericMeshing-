import appModel from './app';
import router from './router';
import alarm from './alarm';


export function registerModels(app) {
  app.model(appModel);
  app.model(alarm);
  app.model(router);

}
