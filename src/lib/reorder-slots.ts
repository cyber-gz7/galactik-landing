import type {
  RobloxOverlayConfig,
  GvgSlotRule,
  MoveSlotPayload
} from '@/types/roblox.types';

/**
 * Reordena o traslada reglas de slots entre columnas (LEFT / RIGHT)
 * y ubicaciones (SIDE / BOTTOM) de forma 100% inmutable para React y Zustand.
 */
export function reorderSlotRules(
  config: RobloxOverlayConfig,
  payload: MoveSlotPayload
): RobloxOverlayConfig {
  const { sourceId, targetId, targetSide, targetPos, insertBefore = true, appendToCategory = false } = payload;

  const left = [...(config.left_rules || [])];
  const right = [...(config.right_rules || [])];

  const sourceIndexLeft = left.findIndex((s) => s.id === sourceId);
  const sourceIndexRight = right.findIndex((s) => s.id === sourceId);

  const sourceItem = sourceIndexLeft !== -1 ? left[sourceIndexLeft] : right[sourceIndexRight];
  if (!sourceItem) return config;

  // 1. Remover de columna origen
  const cleanLeft = left.filter((s) => s.id !== sourceId);
  const cleanRight = right.filter((s) => s.id !== sourceId);

  // 2. Crear clon con posición actualizada si corresponde
  const updatedItem: GvgSlotRule = {
    ...sourceItem,
    is_bottom: targetPos === 'BOTTOM'
  };

  // 3. Determinar lista destino
  const destList = targetSide === 'RIGHT' ? cleanRight : cleanLeft;

  if (targetId) {
    const targetIdx = destList.findIndex((s) => s.id === targetId);
    if (targetIdx !== -1) {
      destList.splice(insertBefore ? targetIdx : targetIdx + 1, 0, updatedItem);
    } else {
      destList.push(updatedItem);
    }
  } else if (appendToCategory) {
    const isTargetBottom = targetPos === 'BOTTOM';
    const sameCatIndices = destList
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => r.is_bottom === isTargetBottom);

    if (sameCatIndices.length > 0) {
      const last = sameCatIndices[sameCatIndices.length - 1].i;
      destList.splice(last + 1, 0, updatedItem);
    } else if (!isTargetBottom) {
      destList.unshift(updatedItem);
    } else {
      destList.push(updatedItem);
    }
  } else {
    destList.push(updatedItem);
  }

  return {
    ...config,
    left_rules: targetSide === 'RIGHT' ? cleanLeft : destList,
    right_rules: targetSide === 'RIGHT' ? destList : cleanRight
  };
}
