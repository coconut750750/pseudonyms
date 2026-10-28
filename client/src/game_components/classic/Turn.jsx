import React from 'react';

export default function classicTurnDescriptor({ turn }) {
  return (
    <h6 className="mb-1">{turn.replace(/^\w/, c => c.toUpperCase())} turn</h6>
  )
}
