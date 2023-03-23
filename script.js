const selection = document.querySelector('.selection')
const playerboard = document.querySelector('.play-board')
const winner = document.querySelector('.winner')

let gameBoard, user= 'X', computer='O';
const cells=document.querySelectorAll('.cell');
const winCombos=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[6,4,2],[2,5,8],[1,4,7],[0,3,6]]

const playerSelect = player =>{

    user= player;
    computer= (player === 'X')?'O' :'X';

    gameBoard=Array.from(Array(9).keys());

    for(let cell of cells){
        cell.addEventListener('click', handleClick, false);
    }
    if(computer === 'X'){
        turn(bestSpot(),computer)
    }

    selection.classList.add('fadeOut')
    setTimeout(()=>{
        selection.style.display='none'
    },290)

    playerboard.classList.add('fadeIn')
    setTimeout(()=>{
        playerboard.style.display='flex'
    },290)
}

const startReset=()=>{
    winner.classList.remove('fadeIn')
    winner.classList.add('fadeOut')
    setTimeout(()=>{
        winner.style.display='none'
    },290)

    playerboard.classList.remove('fadeIn')
    playerboard.classList.add('fadeOut')
    setTimeout(()=>{
        playerboard.style.display='none'
    },290)

   
    selection.classList.add('fadeIn')
    setTimeout(()=>{
        selection.style.display='flex'
    },290)

    for(let cell of cells){
        cell.innerHTML= '';
        cell.style.color='#000';
        cell.style.background='#f8c471';
    }
}
startReset()

const handleClick=(gameSpace)=>{
    if(typeof gameBoard[gameSpace.target.id]=== 'number'){
        turn(gameSpace.target.id, user);
        if(!checkWin(gameBoard,user) && !checkTie()){
            setTimeout(()=>{turn(bestSpot(),computer)},500)
        }
    }
}
const turn=(spaceId, player)=>{

    gameBoard[spaceId]=player;
    document.getElementById(spaceId).innerHTML = player;

    let gameWon= checkWin(gameBoard, player);
    if (gameWon){
        gameOver (gameWon);
    }

    checkTie();
}

const checkWin=(board, player)=>{
    let spaces = board.reduce((acc,ele,idx)=>(ele === player)? acc.concat(idx): acc,[]);
    let gameWon = null;

    for (let [index, winComboSpaces] of winCombos.entries()){
        if(winComboSpaces.every(elem=> spaces.indexOf(elem) > -1)){
            gameWon = {index: index, player:player};
            break;
        }
    }

    return gameWon;
}

const gameOver= gameWon=>{
    let color;
        user === 'X' ? color='#b33951': color='#3498db';
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.color= '#fff';
        document.getElementById(index).style.backgroundColor = color;
    }
    for(let cell of cells){
        cell.removeEventListener('click',handleClick, false);
    }
    declareWinner(gameWon.player === user ? '' : 'Computer Won the Game!', user)
}

const declareWinner= (message,user)=>{
    let mess;
    user === 'X'? mess='"For the horde!" Congratulations!': mess='"For honor, for freedom!" Congratulations!';
    
    message === ''?winner.querySelector('h3').innerHTML = mess:
    winner.querySelector('h3').innerHTML = message;
    

    setTimeout(()=>{

        playerboard.classList.remove('fadeIn');
        playerboard.classList.add('fadeOut');
        setTimeout(()=>{ playerboard.style.display = 'none'}, 290);

  
        winner.classList.add('fadeIn');
        setTimeout(()=>{ winner.style.display = 'flex'}, 290);
    },1500)
}

const bestSpot=()=>{
    return minMax(gameBoard, computer).index;
}

const emptySquares=()=>{
    return gameBoard.filter((elm,i) => i === elm);
}

const checkTie= ()=>{

    if (emptySquares().length === 0){
        selection.classList.remove('fateOut');

        for(let cell of cells){
            cell.style.backgroundColor='#f8c471';
            cell.removeEventListener('click',handleClick, false);
        }

        declareWinner('THE GAME IS TIE!');
        return true;
    }
    return false;
}

const minMax =(testBoard, player)=>{

    let openSpaces= emptySquares(testBoard);

    if(checkWin(testBoard,user))
        return { score: -10};
    else if (checkWin(testBoard,computer))
        return { score:10};
    else if (openSpaces.length === 0)
        return { score: 0};

    let moves= [];

    for(let i= 0; i < openSpaces.length; i++){
        let move={};

        move.index = testBoard[openSpaces[i]];
        testBoard[openSpaces[i]]= player;

        if(player === computer)
            move.score = minMax(testBoard, computer).score;
        else
            move.score = minMax(testBoard, computer).score;

        testBoard[openSpaces[i]] = move.index;

        if( (player === computer && move.score === 10) || (player === user && move.score === -10))
            return move;
        else    
            move.push(move)
    }

    let bestMove, bestScore;

    if(player === computer){

        bestScore = -1000;
        for (let i=0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else{
        bestScore = 1000;
        for (let i=0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}