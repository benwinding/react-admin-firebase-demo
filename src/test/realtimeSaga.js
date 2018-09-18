// In createRealtimeSaga.js
import realtimeSaga from "ra-realtime";
import {
  fb
} from 'react-admin-firebase';

const observeRequest = dataProvider => (type, resource, params) => {
  // Filtering so that only posts are updated in real time
  if (resource !== "posts") return;

  // Use your apollo client methods here or sockets or whatever else including the following very naive polling mechanism
  return {
    subscribe(observer) {
      var r = fb.GetResource(resource);
      var sub = r.realtimeObservable.subscribe(function (newList) {
        dataProvider(type, resource, params)
          .then(results => {
            console.log({
              results
            });
            observer.next(results);
          }) // New data received, notify the observer
          .catch(error => observer.error(error)); // Ouch, an error occured, notify the observer
      });

      const subscription = {
        unsubscribe() {
          sub.unsubscribe();
          // Notify the saga that we cleaned up everything
          observer.complete();
        }
      };

      return subscription;
    }
  };
};

export default dataProvider => realtimeSaga(observeRequest(dataProvider));
