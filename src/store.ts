import { createClient } from '@liveblocks/client';
import type { WithLiveblocks } from '@liveblocks/zustand';
import { liveblocks } from '@liveblocks/zustand';
import { produce } from 'immer';
import { create } from 'zustand';

export type Layer = {
  //   parentId: string | null;
  children: string[];
};

export type Layers = Record<string, Layer>;

type State = {
  layers: Layers;
};

type Actions = {
  moveLayerOutOfParent: () => void;
  moveLayerIntoParent: () => void;
};

const client = createClient({
  throttle: 16,
  publicApiKey:
    'pk_dev_UJeVsugEm0jBO3H9nt4mzYFZJ2E5ptUmxVfV5ArG1ukZ1yPTIDuy-hucTDy767uM',
});

const CHILD_LAYER_ID = 'layer-one';
const PARENT_LAYER_ID = 'layer-two';
const ROOT_LAYER_ID = 'ROOT';

const initialLayers: Layers = {
  [ROOT_LAYER_ID]: {
    children: [PARENT_LAYER_ID],
  },
  [PARENT_LAYER_ID]: {
    children: [CHILD_LAYER_ID],
  },
  [CHILD_LAYER_ID]: {
    children: [],
  },
};

export const useStore = create<WithLiveblocks<State & Actions>>()(
  liveblocks(
    (set, get) => ({
      layers: initialLayers,
      moveLayerIntoParent() {
        const { layers } = get();

        const updatedLayers = produce(layers, (draft) => {
          // Remove from old parent
          const children = layers[ROOT_LAYER_ID].children;

          draft[ROOT_LAYER_ID].children = children.filter(
            (id) => id !== CHILD_LAYER_ID
          );

          // Add to other parent if not already there
          const parentLayer = draft[PARENT_LAYER_ID];

          if (parentLayer.children.includes(CHILD_LAYER_ID)) return;

          draft[PARENT_LAYER_ID].children.push(CHILD_LAYER_ID);
        });

        // Uncomment this console.log to confirm there are no duplicate children when we are modifying the layers
        // console.log({ updatedLayers });

        set({ layers: updatedLayers });
      },
      moveLayerOutOfParent() {
        const { layers } = get();

        const updatedLayers = produce(layers, (draft) => {
          const children = layers[PARENT_LAYER_ID].children;

          // Remove from old parent
          draft[PARENT_LAYER_ID].children = children.filter(
            (id) => id !== CHILD_LAYER_ID
          );

          // Add to root layer
          const rootLayer = draft[ROOT_LAYER_ID];
          if (rootLayer.children.includes(CHILD_LAYER_ID)) return;
          draft[ROOT_LAYER_ID].children.push(CHILD_LAYER_ID);
        });

        // Uncomment this console.log to confirm there are no duplicate children when we are modifying the layers
        // console.log({ updatedLayers });

        set({ layers: updatedLayers });
      },
    }),
    { client, storageMapping: { layers: true } }
  )
);
