import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function Square({ value, onSquareClick }) {
	return (
		<button className='square' onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i) {
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = 'X';
		} else {
			nextSquares[i] = 'O';
		}
		onPlay(nextSquares);
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = 'Winner: ' + winner;
	} else {
		status = 'Next player: ' + (xIsNext ? 'X' : 'O');
	}

	const AllSquares = () => {
		const totalRows = 3;
		const squaresPerRow = 3;

		const RenderCols = ({ row }) => {
			const rows = [];
			// console.log(row);
			let nRow = row * squaresPerRow;
			for (let r = 0; r < squaresPerRow; r++) {
				rows.push(
					<Square
						key={nRow + r}
						value={squares[nRow + r]}
						onSquareClick={() => handleClick(nRow + r)}
					/>
				);
			}
			return rows;
		};

		const RenderRows = [];
		for (let r = 0; r < totalRows; r++) {
			RenderRows.push(
				<div className='board-row'>
					<RenderCols key={r} row={r} />
				</div>
			);
		}
		return RenderRows;
	};

	return (
		<>
			<h1>Tic Tac Toe</h1>
			<div className='card'>
				<div className='status'>{status}</div>

				<AllSquares />

				{/* <div className='board-row'>
					<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
					<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
					<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
				</div>
				<div className='board-row'>
					<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
					<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
					<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
				</div>
				<div className='board-row'>
					<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
					<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
					<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
				</div> */}
			</div>
		</>
	);
}

function calculateWinner(squares) {
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
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const [reset, setReset] = useState(true);
	const [sort, setSort] = useState(true);
	const [moves, setMoves] = useState(null);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
		setReset(false);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	function onReset() {
		setCurrentMove(0);
		setHistory([Array(9).fill(null)]);
	}

	const nmoves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = 'Go to move #' + move;
		} else {
			description = 'Go to game start';
		}
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	useEffect((nmoves) => {
		setMoves(nmoves);
	}, []);

	const handleToggleMoves = () => {
		if (sort) {
			setSort(false);
			setMoves(moves.reverse());
			console.log('clicked true here', moves);
		} else {
			setSort(true);
			setMoves(moves.sort());
			console.log('clicked false', moves);
		}
	};

	return (
		<div className='game'>
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
				<div className='game-info'>You are at move #{currentMove + 1}</div>
				<button onClick={() => onReset()} disabled={reset}>
					Reset
				</button>
			</div>
			<div className='game-info'>
				<div className='toggleMoves'>
					<button
						onClick={() => {
							handleToggleMoves();
						}}>
						Toggle Move
					</button>
				</div>
				<ol>{moves}</ol>
			</div>
		</div>
	);
}
