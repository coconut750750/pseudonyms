import React from 'react';
const _ = require("lodash");

var emojiRe = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

const onlyEmoji = (text) => {
  const chars = _.toArray(text);
  for (let c of chars) {
    if (!emojiRe.test(c)) {
      return false;
    }
  }
  return true;
}

export default function TileText(props) {
  const emojiClass = onlyEmoji(props.text);
  const textClass = emojiClass ? "emoji" : "text";

  return (
    <h6 className={textClass}>{props.text}</h6>
  );
}