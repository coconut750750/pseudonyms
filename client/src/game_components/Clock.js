import React, { useState, useEffect } from 'react';

export default function Clock(props) {
  const [time, setTime] = useState(undefined);

  useEffect(() => {
    props.socket.off('time');
    props.socket.on('time', data => {
      const { time } = data;
      setTime(time)
    });
  }, [props]);

  return (
    <div>
      <h5 className="m-0">{time}</h5>
    </div>
  );
}