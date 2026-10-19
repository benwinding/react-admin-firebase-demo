import { useMemo } from "react";
import { useGetList } from "react-admin";

export const apiUrl =
  window.appConfigs?.api_url || "https://ghostspeak.floraland.tw";

function getActTime(currentNode, name) {
  const delayHour = currentNode[name + "DelayHour"] || 0;
  const delayMin = currentNode[name + "DelayMinute"] || 0;
  const delaySecond = currentNode[name + "DelaySecond"] || 0;
  const delayMilli = currentNode[name + "DelayMilli"] || 0;
  const delay =
    (delayHour * 3600 + delayMin * 60 + delaySecond) * 1000 + delayMilli;
  const randomHour = currentNode[name + "RandomHour"] || 0;
  const randomMin = currentNode[name + "RandomMinute"] || 0;
  const randomSecond = currentNode[name + "RandomSecond"] || 0;
  const randomMilli = currentNode[name + "RandomMilli"] || 0;
  const random =
    (randomHour * 3600 + randomMin * 60 + randomSecond) * 1000 + randomMilli;

  const clockTime = currentNode[name + "Time"]
    ? currentNode[name + "Time"] + ":00"
    : null;
  if (clockTime || delay || random) {
    return {
      target: clockTime,
      minAfter: delay,
      range: random,
    };
  } else return null;
}

// v3's useGetList returned records keyed by id; the publish code relies on that shape
function useGetMap(resource) {
  const { data } = useGetList(resource, {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "published_at", order: "DESC" },
  });
  return useMemo(
    () => Object.fromEntries((data || []).map((r) => [r.id, r])),
    [data]
  );
}

export const useAllData = () => {
  const actions = useGetMap("actions");
  const locations = useGetMap("locations");
  const beacons = useGetMap("beacons");
  const images = useGetMap("images");
  const sounds = useGetMap("sounds");
  const mapStyles = useGetMap("mapStyles");
  const broadcasts = useGetMap("broadcasts");
  const variables = useGetMap("variables");
  const people = useGetMap("people");
  return {
    actions,
    locations,
    beacons,
    images,
    sounds,
    mapStyles,
    broadcasts,
    variables,
    people,
  };
};

export const getActions = (currentNode, data, condition) => {
  const { sounds, locations, images, mapStyles, variables, beacons } = data;
  const ret = [];
  // if (currentNode.hasSound && !sounds[currentNode.soundId]) {
  //   console.log('bad sound:', currentNode.name);
  // }
  const sender = currentNode.sender || "ghost";
  if (currentNode.hasSound && sounds[currentNode.soundId]) {
    const sound = sounds[currentNode.soundId];
    if (!sound) {
      throw `聲音不存在: ${currentNode.name}`;
    }
    if (currentNode.soundCenterId && !locations[currentNode.soundCenterId]) {
      throw `聲音中心點不存在: ${currentNode.name}\n`;
    }
    const fadeOutSeconds = currentNode.fadeOutSeconds;
    const speechLength = currentNode.speechLength;
    const mainVolume = currentNode.speechLength
      ? {
          speechLength,
          fadeOutSeconds: fadeOutSeconds || 5,
        }
      : null;
    const soundAction = {
      id: currentNode.id + "-sound",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "SOUND",
          url: sound ? sound.sound.src : null,
          volumeSetting: {
            type: currentNode.mode || "STATIC_VOLUME",
            center: currentNode.soundCenterId
              ? locations[currentNode.soundCenterId]
              : null,
            fadeOutSeconds,
            speechLength,
            radius: currentNode.range || 30,
            minVolume:
              currentNode.mode === "DYNAMIC_VOLUME"
                ? currentNode.minVolume
                : currentNode.beaconMinVolume,
            minValue: currentNode.beaconMinValue,
            maxValue: currentNode.beaconMaxValue,
            beaconId: currentNode.beaconForSound
              ? beacons[currentNode.beaconForSound].beaconId
              : null,
            mainVolume,
          },
          mode: currentNode.soundType || "MAIN",
        },
        condition: condition,
      },
      delay: currentNode.soundDelay,
      time: getActTime(currentNode, "sound"),
      description: currentNode.name,
    };
    ret.push(soundAction);
  }

  if (currentNode.hasPopup) {
    const ps = currentNode.pictures;
    if (ps) {
      ps.forEach((p) => {
        if (!images[p.pictureId] || !images[p.pictureId].image.src) {
          throw `圖片不存在：${currentNode.name}`;
        }
      });
    }
    const popupAction = {
      id: currentNode.id + "-popup",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "POPUP",
          destinations: currentNode.destinations,
          text: currentNode.text,
          choices:
            currentNode.choices && !currentNode.allowNoReply
              ? currentNode.choices.map((c) => c.choice)
              : [],
          pictures: ps ? ps.map((p) => images[p.pictureId].image.src) : [],
          allowTextReply:
            currentNode.allowTextReply && !currentNode.allowNoReply
              ? true
              : false,
          closeAlertAfterReply: !currentNode.dontCloseAlertAfterReply,
          clearDialog: currentNode.clearDialog,
        },
        condition: condition,
      },
      delay: currentNode.popupDelay,
      time: getActTime(currentNode, "popup"),
      description: currentNode.name,
    };
    ret.push(popupAction);
  }
  if (currentNode.hasIncomingCall) {
    const portrait = images[currentNode.portrait];
    if (!portrait) throw `頭像不存在: ${currentNode.name}`;
    const incomingCallAction = {
      id: currentNode.id + "-incoming-call",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "INCOMING_CALL",
          caller: currentNode.caller,
          portrait: currentNode.portrait ? portrait.image.src : null,
          status: currentNode.callStatus,
        },
        condition: condition,
      },
      delay: currentNode.incomingCallDelay,
      time: getActTime(currentNode, "incomingCall"),
      description: currentNode.name,
    };
    ret.push(incomingCallAction);
  }
  if (currentNode.hasHangUp) {
    const portrait = images[currentNode.portrait];
    if (!portrait) throw `頭像不存在: ${currentNode.name}`;
    const hangUpAction = {
      id: currentNode.id + "-hang-up",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "INCOMING_CALL",
          caller: currentNode.caller,
          portrait: currentNode.portrait
            ? images[currentNode.portrait].image.src
            : null,
          status: "DISCONNECTED",
        },
        condition: condition,
      },
      delay: currentNode.hangUpDelay,
      time: getActTime(currentNode, "hangUp"),
      description: currentNode.name,
    };
    ret.push(hangUpAction);
  }
  if (currentNode.hasMarker) {
    const icon = images[currentNode.markerIcon];
    if (!icon) throw `圖釘不存在: ${currentNode.name}`;
    const location = locations[currentNode.locationId];
    if (!location) throw `地點不存在: ${currentNode.name}`;
    const markerAction = {
      id: currentNode.id + "-marker",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "MARKER",
          icon: currentNode.markerIcon
            ? icon.image.src
            : // ? `${cdnRoot}/${props.record.id}/images/${currentNode.markerIcon}/image`
              null,
          location: currentNode.locationId ? location : null,
          title: currentNode.title,
          id: currentNode.markerId,
        },
        condition: condition,
      },
      delay: currentNode.markerDelay,
      time: getActTime(currentNode, "marker"),
      description: currentNode.name,
    };
    ret.push(markerAction);
  }
  if (currentNode.hasMarkerRemoval) {
    const markerRemovalAction = {
      id: currentNode.id + "-marker-removal",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "MARKER_REMOVAL",
          id: currentNode.markerId + "-marker",
        },
        condition: condition,
      },
      delay: currentNode.markerRemovalDelay,
      time: getActTime(currentNode, "marker"),
      description: currentNode.name,
    };
    ret.push(markerRemovalAction);
  }
  if (currentNode.hasPopupDismissal) {
    const popupDismissalAction = {
      id: currentNode.id + "-popup-dismissal",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "POPUP_DISMISSAL",
          destinations: currentNode.dismissalDestinations,
        },
        condition: condition,
      },
      delay: currentNode.dismissalDelay,
      time: getActTime(currentNode, "dismissal"),
      description: currentNode.name,
    };
    ret.push(popupDismissalAction);
  }
  if (currentNode.hasMapStyle && mapStyles[currentNode.mapStyle]) {
    const mapStyle = mapStyles[currentNode.mapStyle];
    const mapStyleAction = {
      id: currentNode.id + "-map-style",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "MAP_STYLE",
          url: currentNode.satellite
            ? null
            : currentNode.mapStyle
            ? mapStyle.mapStyle.src
            : null,
          satellite: currentNode.satellite,
        },
        condition: condition,
      },
      delay: currentNode.mapStyleDelay,
      time: getActTime(currentNode, "mapStyle"),
      description: currentNode.name,
    };
    ret.push(mapStyleAction);
  }
  if (currentNode.hasIntroImage) {
    const introBackground = images[currentNode.introBackground];
    // if (!introBackground) throw `背景不存在: ${currentNode.name}`;
    const introLogo = images[currentNode.introLogo];
    const introLogoUrl = currentNode.noIntroLogo
      ? "https://storage.googleapis.com/daqiaotou/images/Empty.png"
      : introLogo?.image.src;
    // if (!introLogo) throw `Logo不存在: ${currentNode.name}`;
    const mapLogo = images[currentNode.mapLogo];
    // if (!mapLogo) throw `地圖Logo不存在: ${currentNode.name}`;
    const introImageAction = {
      id: currentNode.id + "-intro-image",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "INTRO_IMAGE",
          backgroundUrl: currentNode.introBackground
            ? introBackground.image.src
            : null,
          logoUrl: introLogoUrl,
          textColor: currentNode.introTextColor || null,
          mapLogoUrl: currentNode.mapLogo ? mapLogo.image.src : null,
          logoMarginTop: currentNode.introLogoMarginTop,
          logoWidth: currentNode.introLogoWidth,
          logoHeight: currentNode.introLogoHeight,
        },
        condition: condition,
      },
      delay: currentNode.introImageDelay,
      time: getActTime(currentNode, "introImage"),
      description: currentNode.name,
    };
    ret.push(introImageAction);
  }
  if (currentNode.hasButtonStyle) {
    const buttonStyleAction = {
      id: currentNode.id + "-button-style",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "BUTTON_STYLE",
          textColor: currentNode.textColor,
          backgroundColor: currentNode.backgroundColor,
        },
        condition: condition,
      },
      delay: currentNode.backgroundDelay,
      time: getActTime(currentNode, "background"),
      description: currentNode.name,
    };
    ret.push(buttonStyleAction);
  }
  if (currentNode.hasPopupStyle) {
    const popupStyleAction = {
      id: currentNode.id + "-popup-style",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "POPUP_STYLE",
          alertTextColor: currentNode.alertTextColor,
        },
        condition: condition,
      },
      delay: currentNode.popupStyleDelay,
      time: getActTime(currentNode, "popStyle"),
      description: currentNode.name,
    };
    ret.push(popupStyleAction);
  }
  if (currentNode.hasVariableUpdate) {
    const variableUpdates = currentNode.variableUpdates.map((vu) => ({
      name: vu.variable ? variables[vu.variable]?.name : null,
      operation: vu.operation,
      value: vu.value,
    }));

    const variableAction = {
      id: currentNode.id + "-variable-update" + "",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "VARIABLE_UPDATES",
          updates: variableUpdates,
        },
        condition: condition,
      },
      description: currentNode.name,
    };
    ret.push(variableAction);
  }
  if (currentNode.firstAction) {
    const updates = [];
    for (const key in variables) {
      const v = variables[key];
      updates.push({
        name: v.name,
        operation: "=",
        value: v.value,
      });
    }
    const variableAction = {
      id: currentNode.id + "-variable-default" + "",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "VARIABLE_UPDATES",
          updates: updates,
        },
        condition: condition,
      },
      description: currentNode.name,
    };
    ret.push(variableAction);
  }
  if (currentNode.endgame) {
    const endgameAction = {
      id: currentNode.id + "-endgame",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "END_GAME",
        },
        condition: condition,
      },
      delay: currentNode.endgameDelay,
      time: getActTime(currentNode, "endgame"),
      description: currentNode.name,
    };
    ret.push(endgameAction);
  }
  if (currentNode.hasGuideImage) {
    const guideImage = images[currentNode.guideImage];
    if (!guideImage) throw `指引圖片不存在: ${currentNode.name}`;
    const guideImageAction = {
      id: currentNode.id + "-guide-image",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "GUIDE_IMAGE",
          image: currentNode.guideImage ? guideImage.image.src : null,
        },
        condition: condition,
      },
      delay: currentNode.guideImageDelay,
      time: getActTime(currentNode, "guideImage"),
      description: currentNode.name,
    };
    ret.push(guideImageAction);
  }
  if (currentNode.hasGuideImageRemoval) {
    const guideImageRemovalAction = {
      id: currentNode.id + "-guide-image-removal",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "GUIDE_IMAGE_REMOVAL",
          id: currentNode.guideImageId,
        },
        condition: condition,
      },
      delay: currentNode.guideImageRemovalDelay,
      time: getActTime(currentNode, "guideImage"),
      description: currentNode.name,
    };
    ret.push(guideImageRemovalAction);
  }
  if (currentNode.hasSilence) {
    const silenceAction = {
      id: currentNode.id + "-silence",
      receiver: "?u",
      sender: sender,
      content: {
        task: {
          type: "SILENCE",
          id: currentNode.silencedSound + "-sound",
          fadeOutSeconds: currentNode.forceFadeOutSeconds,
        },
        condition: condition,
      },
      delay: currentNode.silenceDelay,
      time: getActTime(currentNode, "silence"),
      description: currentNode.name,
    };
    ret.push(silenceAction);
  }
  return ret.map((a) => ({
    ...a,
    session: {
      scenario: "",
      chapter: "",
    },
  }));
};
