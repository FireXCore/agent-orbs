export const ORB_STATES = ['working','searching','solving','listening','connecting','weaving','composing','breathing','shaping'] as const;
export type OrbState = (typeof ORB_STATES)[number];
/** Renderer-only types with no framework dependencies. */
export type Dot = { x: number; y: number; z: number; r: number; a: number; hot?: number };
export type Segment = { a: Dot; b: Dot; opacity: number };
export type Scene = { dots: Dot[]; lines: Segment[] };
