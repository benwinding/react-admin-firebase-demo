import * as React from "react";
import { ImageField, useRecordContext } from "react-admin";
import get from "lodash/get";
import set from "lodash/set";
const cdnUrl = "http://daqiaotou-storage.floraland.tw/";
const origUrl = "https://storage.googleapis.com/daqiaotou/";

export const MyImageField = (props) => {
  const record = useRecordContext(props);
  if (props.source) {
    const sourceValue = get(record, props.source);
    if (sourceValue && sourceValue.startsWith(cdnUrl)) {
      set(record, props.source, sourceValue.replace(cdnUrl, origUrl));
    }
  }
  return <ImageField {...props} />;
};
