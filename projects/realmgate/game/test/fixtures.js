// A small home: living room (5 x 4 m) with a sofa, a hallway, and a yard.
export const HOME = {
  v: 1, id: 'test-home', name: 'Test home',
  hearth: { x: 0, z: 0, zone: 'living' },
  zones: [
    {
      id: 'living', name: 'Living room', kind: 'room', theme: 'hearth', floorY: 0,
      floor: [[-2.5, -2], [2.5, -2], [2.5, 2], [-2.5, 2]],
      walls: [], openings: [],
      objects: [
        { cat: 'sofa', x: 0, y: 0.4, z: -1.2, w: 2.2, h: 0.8, d: 0.9, yaw: 0 },
        { cat: 'table', x: 1.6, y: 0.4, z: 1.2, w: 0.8, h: 0.75, d: 0.8, yaw: 0.4 },
      ],
    },
    {
      id: 'hall', name: 'Hallway', kind: 'hall', theme: 'gloam', floorY: 0,
      floor: [[2.5, -0.5], [6.5, -0.5], [6.5, 0.5], [2.5, 0.5]],
      walls: [], openings: [], objects: [{ cat: 'stairs', x: 5.8, y: 0.5, z: 0, w: 1, h: 1, d: 1, yaw: 0 }],
    },
    {
      id: 'yard', name: 'Yard', kind: 'outdoor', theme: 'wilds', floorY: -0.2,
      floor: [[6.5, -3], [12, -3], [12, 3], [6.5, 3]],
      walls: [], openings: [], objects: [],
    },
  ],
  links: [{ a: 'living', b: 'hall', x: 2.5, z: 0, w: 0.9 }, { a: 'hall', b: 'yard', x: 6.5, z: 0, w: 0.9 }],
};
