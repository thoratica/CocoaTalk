import React, { useState, useRef } from 'react';
import { WindowScroller, CellMeasurer, CellMeasurerCache, AutoSizer, List, ListRowProps } from 'react-virtualized';

const cache = new CellMeasurerCache({
  defaultWidth: 100,
  fixedWidth: true,
});

const VirtualScroll = ({ items, height, listRef }: { items: JSX.Element[]; height: number; listRef: React.RefObject<List> }) => {
  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
    return (
      <CellMeasurer cache={cache} parent={parent} key={key} columnIndex={0} rowIndex={index}>
        <div style={style}>{items[index]}</div>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <List
          className={'virtualScroll'}
          ref={listRef}
          height={height}
          width={width}
          overscanRowCount={0}
          rowCount={items.length}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          deferredMeasurementCache={cache}
        />
      )}
    </AutoSizer>
  );
};

export default VirtualScroll;
