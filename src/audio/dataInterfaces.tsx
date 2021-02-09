interface DBSteprow {
  audioPath: string;
  createdAt: string;
  id: string;
  name: string;
  pattern: (0 | 1)[];
  setId: string;
  updatedAt: string;
}

export interface Set {
  id: string;
  name: string;
  swing: number;
  tempo: number;
  updatedAt: string;
  createdAt: string;
  synthPattern: (0 | 1)[][];
  steprows: DBSteprow[];
}