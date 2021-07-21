import React,{useMemo,useState,useCallback} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)  {
      return (
        <button 
          className="square" 
          onClick={props.onClick}
        >
          {props.value} 
        </button>
      );
  }

function Board(props){
   function renderSquare(i) {
    return (<Square 
              value={props.squares[i]} 
              onClick={() => props.onClick(i)}
           />
    );
  };
  return(
    <div>
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
  )
}
  
  function Game(){
    const [history,setHistory] = useState([{squares:Array(9).fill(null)}]);
    const [stepNumber,setStepNumber] = useState(0);
    const [xIsNext,setxISNext] = useState(true);

    const handleClick = useCallback((i)=>{
      const history2 = history.slice(0,stepNumber+1);
       const current = history2[history2.length-1];
       const squares = current.squares.slice();
       if(calculateWinner(squares) || squares[i]){
         return;
       }
       squares[i] = xIsNext ? 'X':'O';
       setHistory(history2.concat([{squares:squares}]));
       setStepNumber(history2.length);
       setxISNext(!xIsNext);
    },[history,stepNumber,xIsNext])
     
    const squares2 = useMemo(()=>{
      return (history[stepNumber].squares)
    },[history,stepNumber])

    // function handleClick(i){
    //    const history2 = history.slice(0,stepNumber+1);
    //    const current = history2[history2.length-1];
    //    const squares = current.squares.slice();
    //    if(calculateWinner(squares) || squares[i]){
    //      return;
    //    }
    //    squares[i] = xIsNext ? 'X':'O';
    //    setHistory(history2.concat([{squares:squares}]));
    //    setStepNumber(history2.length);
    //    setxISNext(!xIsNext);
    // }

    function jumpTo(step){
       setStepNumber(step);
       setxISNext((step%2) ===0);
    }
    
    //更新 Game 组件的 render 函数，使用最新一次历史记录来确定并展示游戏的状态
    // const history= history;
    // const current = history[stepNumber];
    // const winner = calculateWinner(current.squares);
       const winner = calculateWinner(history[stepNumber].squares);  //可以直接写为这样

    const moves = history.map((step,move)=>{
      const desc = move ? 
             'Go to move #' + move:
             'Go to game start';
             return(
                 <li key={move}>
                     <button onClick={()=>jumpTo(move)}>{desc}</button>
                 </li>
             );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return(
      <div className="game">
          <div className="game-board">
            <Board 
              squares={squares2}
              onClick={i => handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
    )
  }


  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for(let i=0;i<lines.length;i++){
        const[a,b,c]=lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
           return squares[a];
        }
    }
    return null;
}
  