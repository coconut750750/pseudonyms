import React from 'react';

var emojiRe = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/

export default function TileText(props) {
  const emojiClass = emojiRe.test(props.text);
  const textClass = emojiClass ? "emoji" : "text";

  return (
    <h6 className={textClass}>{props.text}</h6>
  );
}