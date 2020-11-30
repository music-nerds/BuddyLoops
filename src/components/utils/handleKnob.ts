export interface KnobData {
  value: number;
  rotation: number;
  startY: number;
  curY: number;
  selected: boolean;
}

export const initialKnobData = {
  value: 1,
  rotation: 0.4,
  startY: 0,
  curY: 0,
  selected: false
}