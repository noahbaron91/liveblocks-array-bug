import { useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Informaton } from './Information';
import { Layers, useStore } from './store';
import { getBackgroundColor } from './utils';

type RenderLayerProps = {
  layers: Layers;
  id: string;
};

function fallbackRender({ error }: FallbackProps) {
  return (
    <div role='alert'>
      <pre style={{ color: 'red', fontSize: 16 }}>
        <p>Child array value was duplicated by liveblocks:</p>
        {error.message}
      </pre>
    </div>
  );
}

function RenderLayer({ layers, id }: RenderLayerProps) {
  const layer = layers[id];

  // Checks if there are duplicates in the children array
  const hasDuplicates = new Set(layer.children).size !== layer.children.length;

  if (hasDuplicates) {
    throw new Error(
      `Layer ${id} has duplicate children. Layers: ${JSON.stringify(layers)}}`
    );
  }

  const children = layer.children.map((child) => {
    return <RenderLayer id={child} key={child} layers={layers} />;
  });

  return (
    <div style={{ background: getBackgroundColor(id), padding: 100 }}>
      {children}
    </div>
  );
}

const DELAY_PER_ACTION = 25;

function App() {
  const layers = useStore((state) => state.layers);
  const moveLayerIntoParent = useStore((state) => state.moveLayerIntoParent);
  const moveLayerOutOfParent = useStore((state) => state.moveLayerOutOfParent);

  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  useEffect(() => {
    enterRoom('room-id');
    return () => {
      leaveRoom('room-id');
    };
  }, [enterRoom, leaveRoom]);

  useEffect(() => {
    console.log('updated layers from liveblocks', layers);
  }, [layers]);

  useEffect(() => {
    let shouldMoveLayerIntoParent = true;

    // Alternates between moving the layer into and out of the parent
    const moveLayerInterval = setInterval(() => {
      if (shouldMoveLayerIntoParent) {
        moveLayerIntoParent();
        shouldMoveLayerIntoParent = false;
      } else {
        moveLayerOutOfParent();
        shouldMoveLayerIntoParent = true;
      }
    }, DELAY_PER_ACTION);

    return () => {
      clearInterval(moveLayerInterval);
    };
  }, [moveLayerIntoParent, moveLayerOutOfParent]);

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <RenderLayer layers={layers} id={'ROOT'} />
      <Informaton intervalSpeed={DELAY_PER_ACTION} />
    </ErrorBoundary>
  );
}

export default App;
