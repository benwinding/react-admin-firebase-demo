import * as React from "react";

import { Box } from "@mui/material";

const styles = {
  maxWidth: "600px",
  marginLeft: "50px",
  marginTop: "25px",
  fontFamily: "sans-serif",
  "& .image": {
    maxWidth: "600px",
    width: "100%",
  },
  "& .portrait": {
    maxWidth: "190px",
    maxHeight: "190px",
    width: "33%",
    height: "33%",
    objectFit: "cover",
    objectPosition: "0% 0%",
    margin: "5px",
  },
  "& .title": {
    fontFamily: "sans-serif",
  },
  "& .list": {
    margin: "5px 0",
  },
  "& .final": {
    margin: "0 0 50px 0",
  },
};

export const UrbanBaker = () => {
  return (
    <Box sx={styles}>
      <h1 className="title">We Are Urban Baker</h1>
      <span>
        <img
          src="https://storage.googleapis.com/daqiaotou/images/sungting.jpg"
          className="portrait"
        />
        <img
          src="https://storage.googleapis.com/daqiaotou/images/flora.jpg"
          className="portrait"
        />
        <img
          src="https://storage.googleapis.com/daqiaotou/images/toby.jpg"
          className="portrait"
        />
      </span>
      <span>
        <img
          src="https://storage.googleapis.com/daqiaotou/images/wei.jpg"
          className="portrait"
        />
        <img
          src="https://storage.googleapis.com/daqiaotou/images/hsuehmin-mask.jpg"
          className="portrait"
        />
        <img
          src="https://storage.googleapis.com/daqiaotou/images/eason.jpg"
          className="portrait"
        />
      </span>
      <p>
        Urban
        Baker是一個跨領域的科技互動團隊。從2014年以來，持續與不同的藝文團體合作，
        用手機與GPS定位的技術，把人們帶到街區，提供虛實交錯的故事體驗。
      </p>
      <img
        src="https://storage.googleapis.com/daqiaotou/images/daqiaotou-walking.jpg"
        className="image"
      />
      <p>
        除近年代表作品，與
        {
          <a href="https://thedoubletheatre.wixsite.com/thedoubletheatre">
            複象公場
          </a>
        }
        劇團合作，穿梭在大橋頭今昔街區的漫遊劇場
        <a href="https://www.facebook.com/search/top?q=%E5%A4%A7%E6%A9%8B1988">
          《大橋1988：自由年代》
        </a>
        之外，在台灣各城市以及紐約、新加坡、馬來西亞檳城都有旅人跟隨Urban Baker
        app感受不為人知的街區故事。
      </p>
      <p>
        我們的開放「Urban
        Baker街區編輯器」讓非技術背景的人們也能創作自己的街區故事。有興趣的創作者皆可試用。
        若需要洽談進一步的合作、使用教學，或想將您的活動正式上架，請與我們連絡！
        <ul>
          <li className="list">
            FB粉絲專頁：
            <a
              href="https://www.facebook.com/urbanbakers"
              target="_blank"
              rel="noreferrer"
            >
              https://www.facebook.com/urbanbakers
            </a>
          </li>
          <li className="list">
            Email：
            <a
              href="mailto:team@urbanbaker.net"
              target="_blank"
              rel="noreferrer"
            >
              team@urbanbaker.net
            </a>
          </li>
          <li className="list">
            部分作品列表：
            <a
              href="https://linktr.ee/urbanbaker2022"
              target="_blank"
              rel="noreferrer"
            >
              https://linktr.ee/urbanbaker2022
            </a>
          </li>
        </ul>
      </p>
      <p className="final">
        請搭配Urban Baker手機應用程式使用：
        <ul>
          <li className="list">
            <a
              href="https://apps.apple.com/tw/app/urban-baker/id6443626002"
              target="_blank"
              rel="noreferrer"
            >
              iOS
            </a>
          </li>
          <li className="list">
            <a
              href="https://play.google.com/store/apps/details?id=tw.idv.idiotech.ghostspeak&hl=zh_TW"
              target="_blank"
              rel="noreferrer"
            >
              Android
            </a>
          </li>
        </ul>
      </p>
    </Box>
  );
};
