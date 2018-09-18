// In createRealtimeSaga.js
import realtimeSaga from "ra-realtime";
import {
  fb
} from 'react-admin-firebase';

const observeRequest = (dataProvider, options) => (type, resource, params) => {
  // Filtering so that only posts are updated in real time
  console.log({options, resource});
  if (resource !== 'posts') {
    return;
  }
  if (options && options.observe && options.observe.includes(resource)) {
    return;
  }

  // Use your apollo client methods here or sockets or whatever else including the following very naive polling mechanism
  return {
    subscribe(observer) {
      const resourceObj = fb.GetResource(resource);
      const sub = resourceObj.observable.subscribe(function () {
        dataProvider(type, resource, params)
          .then(results => observer.next(results)) // New data received, notify the observer
          .catch(error => observer.error(error)); // Ouch, an error occured, notify the observer
      });

      const subscription = {
        unsubscribe() {
          // Notify the saga that we cleaned up everything
          observer.complete();
          // sub.unsubscribe();
        }
      };

      return subscription;
    }
  };
};

export default (dataProvider) => { 
  return realtimeSaga(observeRequest(dataProvider));
}
