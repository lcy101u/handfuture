export interface HandLandmarkDefinition {
  index: number;
  name: string;
  x: number;
  y: number;
  finger: "wrist" | "thumb" | "index" | "middle" | "ring" | "pinky";
  segment: "wrist" | "cmc" | "mcp" | "pip" | "dip" | "ip" | "tip";
}

export const HAND_LANDMARKS: readonly HandLandmarkDefinition[] = [
  { index: 0, name: "WRIST", x: 50, y: 91, finger: "wrist", segment: "wrist" },
  { index: 1, name: "THUMB_CMC", x: 35, y: 75, finger: "thumb", segment: "cmc" },
  { index: 2, name: "THUMB_MCP", x: 25, y: 64, finger: "thumb", segment: "mcp" },
  { index: 3, name: "THUMB_IP", x: 16, y: 52, finger: "thumb", segment: "ip" },
  { index: 4, name: "THUMB_TIP", x: 8, y: 40, finger: "thumb", segment: "tip" },
  { index: 5, name: "INDEX_FINGER_MCP", x: 39, y: 53, finger: "index", segment: "mcp" },
  { index: 6, name: "INDEX_FINGER_PIP", x: 34, y: 37, finger: "index", segment: "pip" },
  { index: 7, name: "INDEX_FINGER_DIP", x: 31, y: 24, finger: "index", segment: "dip" },
  { index: 8, name: "INDEX_FINGER_TIP", x: 29, y: 10, finger: "index", segment: "tip" },
  { index: 9, name: "MIDDLE_FINGER_MCP", x: 52, y: 50, finger: "middle", segment: "mcp" },
  { index: 10, name: "MIDDLE_FINGER_PIP", x: 52, y: 31, finger: "middle", segment: "pip" },
  { index: 11, name: "MIDDLE_FINGER_DIP", x: 52, y: 17, finger: "middle", segment: "dip" },
  { index: 12, name: "MIDDLE_FINGER_TIP", x: 52, y: 4, finger: "middle", segment: "tip" },
  { index: 13, name: "RING_FINGER_MCP", x: 64, y: 53, finger: "ring", segment: "mcp" },
  { index: 14, name: "RING_FINGER_PIP", x: 68, y: 36, finger: "ring", segment: "pip" },
  { index: 15, name: "RING_FINGER_DIP", x: 70, y: 24, finger: "ring", segment: "dip" },
  { index: 16, name: "RING_FINGER_TIP", x: 72, y: 12, finger: "ring", segment: "tip" },
  { index: 17, name: "PINKY_MCP", x: 75, y: 59, finger: "pinky", segment: "mcp" },
  { index: 18, name: "PINKY_PIP", x: 83, y: 47, finger: "pinky", segment: "pip" },
  { index: 19, name: "PINKY_DIP", x: 88, y: 38, finger: "pinky", segment: "dip" },
  { index: 20, name: "PINKY_TIP", x: 93, y: 29, finger: "pinky", segment: "tip" },
];

export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
] as const;
