import * as g from "./BoardGenService";

describe("testing calculateCellTouchDirection with boardsize 3", ()=>{
  const boardSize = 3;
  it("direction up", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 0, 1)
    expect(res).toEqual(g.Direction.Up);
  })
  it("direction down", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 2, 1)
    expect(res).toEqual(g.Direction.Down);
  })
  it("direction left", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 1, 0)
    expect(res).toEqual(g.Direction.Left);
  })
  it("direction right", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 1, 2)
    expect(res).toEqual(g.Direction.Right);
  })
})

describe("testing calculateCellTouchDirection with boardsize 6", ()=>{
  const boardSize = 6;
  it("direction up", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 0, 1)
    expect(res).toEqual(g.Direction.Up);
  })
  it("direction down", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 4, 3)
    expect(res).toEqual(g.Direction.Down);
  })
  it("direction left", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 3, 0)
    expect(res).toEqual(g.Direction.Left);
  })
  it("direction right", ()=>{
    const res = g.calculateCellTouchDirection(boardSize, 3, 4)
    expect(res).toEqual(g.Direction.Right);
  })
})