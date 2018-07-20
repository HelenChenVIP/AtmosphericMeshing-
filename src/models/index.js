import appModel from './app';
import router from './router';
import alarm from './alarm';
import map from './map';
import pointdetails from './pointdetails';


export function registerModels(app) {
  app.model(appModel);
  app.model(alarm);
  app.model(router);
  app.model(map);
  app.model(pointdetails);
}
