import './App.css';
import { useEffect, useState } from 'react';

export default function MazeGrid({width = 20, height = 20}) {

  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState([]);

  useEffect(() => {
    generateMaze(width, height);
  }, []);

  function bfs(startNode) {

    let queue = [startNode];
    let visited = new Set(`${startNode[0]}, ${startNode[1]}`);
    

    function visitCell([x, y]) {
      console.log(x, y);

      setMaze((prevMaze) => 
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if(rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited"
            }
            return cell;
          }),
        ),
      );
      if(maze[y][x] === "end") {
        console.log("path found")
        return true;
      }
      return false;


    }

    function step() {
      if(queue.length === 0) {
        return;
      }

      const [x, y] = queue.shift();//Removes first element of queue array and stores it 
      console.log("New Step")
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
      ];

      for(const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if(nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(`${nx}, ${ny}`)) {
          visited.add(`${nx}, ${ny}`)
          if(maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if(visitCell([nx, ny])) {
              return true;
            }
            queue.push([nx, ny])
          }
        }
      }
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId])
    }

    step();
    return false;
  }


  function dfs(startNode) {

    let stack = [startNode];
    let visited = new Set(`${startNode[0]}, ${startNode[1]}`);
    

    function visitCell([x, y]) {
      console.log(x, y)

      setMaze((prevMaze) => 
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if(rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited"
            }
            return cell;
          }),
        ),
      );

      if(maze[y][x] === "end") {
        console.log("path found")
        return true
      }
      return false


    }

    function step() {
      if(stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop();//Removes first element of queue array and stores it 
      console.log("New Step")
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
      ];

      for(const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if(nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(`${nx}, ${ny}`)) {
          visited.add(`${nx}, ${ny}`)
          if(maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if(visitCell([nx, ny])) {
              return true
            }
            stack.push([nx, ny])
          }
        }
      }
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId])
    }

    step();
    return false;
  }

  function generateMaze (height, width) {
    let matrix = [];

    for (let i = 0; i < height; i++) {
      let row = [];

      for(let j = 0; j < width; j++) {
        let cell = Math.random();

        row.push("wall")
      }
      matrix.push(row); 
    }
    console.log(matrix);

    const dirs = [
    [0, 1],//Moving to the right
    [1, 0],//Moving down
    [0, -1],//Moving to the left
    [-1, 0]//Moving up
  ];

    function isCellValid(x, y) {//check if cell is a valid target for carving a path

      //The cell coordinates (x, y) must be within the maze's dimensions.
      return (y >= 0 && x >= 0 && x < width && y < height && matrix[y][x] === "wall");
    }

    function carvePath (x, y) {
      matrix[y][x] = "path";//// Carve out the current cell as part of the path

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2
        const ny = y + dy * 2

        if(isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carvePath(nx, ny);
        }
      }
    }

    carvePath(1, 1)
    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";
    setMaze(matrix);
  }

  function refreshMaze() {
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([])
    generateMaze(20, 20);
  }

  return (
    <div className='maze-grid'>
      <div className='controls'>
        <button className='maze-button' onClick ={() => refreshMaze()}>Refresh Maze</button>
        <button className='maze-button' onClick ={() => bfs([1, 0])}>Breadth-First Search</button>
        <button className='maze-button' onClick ={() => dfs([1, 0])}>Depth-First Search</button>
      </div>
      <div className='maze'>
        {/* maps trough rows of arrays */}
        {maze.map((row, rowIndex) => (
          <div className='row'>
            {row.map((cell, cellIndex) => (
              // maps trough content in the arrays
              <div className={`cell ${cell}`}></div>
            ))}
            </div>
        ) )}
      </div>
    </div>
  )
}
