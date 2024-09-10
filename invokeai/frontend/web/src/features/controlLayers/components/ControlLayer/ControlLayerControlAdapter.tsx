import { Flex } from '@invoke-ai/ui-library';
import { createMemoizedAppSelector } from 'app/store/createMemoizedSelector';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { BeginEndStepPct } from 'features/controlLayers/components/common/BeginEndStepPct';
import { Weight } from 'features/controlLayers/components/common/Weight';
import { ControlLayerControlAdapterControlMode } from 'features/controlLayers/components/ControlLayer/ControlLayerControlAdapterControlMode';
import { ControlLayerControlAdapterModel } from 'features/controlLayers/components/ControlLayer/ControlLayerControlAdapterModel';
import { useEntityIdentifierContext } from 'features/controlLayers/contexts/EntityIdentifierContext';
import {
  controlLayerBeginEndStepPctChanged,
  controlLayerControlModeChanged,
  controlLayerModelChanged,
  controlLayerWeightChanged,
} from 'features/controlLayers/store/canvasSlice';
import { selectCanvasSlice, selectEntityOrThrow } from 'features/controlLayers/store/selectors';
import type { CanvasEntityIdentifier, ControlModeV2 } from 'features/controlLayers/store/types';
import { memo, useCallback, useMemo } from 'react';
import type { ControlNetModelConfig, T2IAdapterModelConfig } from 'services/api/types';

const useControlLayerControlAdapter = (entityIdentifier: CanvasEntityIdentifier<'control_layer'>) => {
  const selectControlAdapter = useMemo(
    () =>
      createMemoizedAppSelector(selectCanvasSlice, (canvas) => {
        const layer = selectEntityOrThrow(canvas, entityIdentifier);
        return layer.controlAdapter;
      }),
    [entityIdentifier]
  );
  const controlAdapter = useAppSelector(selectControlAdapter);
  return controlAdapter;
};

export const ControlLayerControlAdapter = memo(() => {
  const dispatch = useAppDispatch();
  const entityIdentifier = useEntityIdentifierContext('control_layer');
  const controlAdapter = useControlLayerControlAdapter(entityIdentifier);

  const onChangeBeginEndStepPct = useCallback(
    (beginEndStepPct: [number, number]) => {
      dispatch(controlLayerBeginEndStepPctChanged({ entityIdentifier, beginEndStepPct }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeControlMode = useCallback(
    (controlMode: ControlModeV2) => {
      dispatch(controlLayerControlModeChanged({ entityIdentifier, controlMode }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeWeight = useCallback(
    (weight: number) => {
      dispatch(controlLayerWeightChanged({ entityIdentifier, weight }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeModel = useCallback(
    (modelConfig: ControlNetModelConfig | T2IAdapterModelConfig) => {
      dispatch(controlLayerModelChanged({ entityIdentifier, modelConfig }));
    },
    [dispatch, entityIdentifier]
  );

  return (
    <Flex flexDir="column" gap={3} position="relative" w="full">
      <ControlLayerControlAdapterModel modelKey={controlAdapter.model?.key ?? null} onChange={onChangeModel} />
      <Weight weight={controlAdapter.weight} onChange={onChangeWeight} />
      <BeginEndStepPct beginEndStepPct={controlAdapter.beginEndStepPct} onChange={onChangeBeginEndStepPct} />
      {controlAdapter.type === 'controlnet' && (
        <ControlLayerControlAdapterControlMode
          controlMode={controlAdapter.controlMode}
          onChange={onChangeControlMode}
        />
      )}
    </Flex>
  );
});

ControlLayerControlAdapter.displayName = 'ControlLayerControlAdapter';
