import React, { useCallback, useEffect, useState } from 'react';
import { CellMeasurer, CellMeasurerCache, AutoSizer, List, ListRowProps } from 'react-virtualized';

const cache = new CellMeasurerCache({
  defaultWidth: 100,
  fixedWidth: true,
});

const VirtualScroll = ({
  items,
  height,
  listRef,
  reRender,
}: {
  items: (({ measure }: { measure: () => void }) => JSX.Element)[];
  height: number;
  listRef: React.RefObject<List>;
  reRender: any;
}) => {
  useEffect(() => {
    cache.clearAll();
  }, [reRender]);

  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
    return (
      <CellMeasurer cache={cache} parent={parent} key={key} columnIndex={0} rowIndex={index}>
        {({ measure }) => {
          const Tmp = items[index];
          return (
            <div style={style}>
              <Tmp measure={measure} />
            </div>
          );
        }}
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
