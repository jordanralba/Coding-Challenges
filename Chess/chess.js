function populateNode(attributes = [], children = null, parent = null) {
    attributes.forEach(({ element = 'div', ...atts }, index) => {
        const newNode = document.createElement(element);
        for (const key of Object.keys(atts)) {
            switch (key) {
                case 'text': // let this be a fall-through case
                    newNode[key] = atts[key];
                    break;
                case 'children': populateNode(atts[key], null, newNode);
                    break;
                default: newNode.setAttribute(key, atts[key]);
                    break;
            }
        }
        if (parent) parent.appendChild(newNode);
        else if (children) {
            children[index]?.appendChild(newNode);
        }
        else console.error('ERROR no children or parent provided for populateNode()')
    })
}
class Tile {
    constructor(column, row){
        const cols = Board.cols;
        //this.column = column;
        //this.row = row;
        this.position = column + row;
        switch(column){
            case 'A': case 'C': case 'E': case 'G':
                if(row % 2 === 0){
                    this.color = 'white';
                }else{
                    this.color = 'black';
                } 
                break;
            default: 
                if(row % 2 === 0){
                    this.color = 'black';
                }else{
                    this.color = 'white';
                }
        }
        const northDiags = this.north(column, row, cols);
        const southDiags = this.south(column, row, cols);
        const eastDiags = this.east(column, row, cols);
        const westDiags = this.west(column, row, cols);
        const northKnight = {north:this.north(column, row+1, cols).slice(1, 2).toString(), west:this.west(column, row+1, cols).slice(1, 2).toString()};
        const southKnight = {south:this.south(column, row-1, cols).slice(1, 2).toString(), east:this.east(column, row-1, cols).slice(1, 2).toString()};
        const eastKnight = {north:this.north(cols[cols.indexOf(column)+1], row, cols).slice(1, 2).toString(), east:this.east(cols[cols.indexOf(column)+1], row, cols).slice(1, 2).toString()};
        console.log(`${column} ${row}: `,eastKnight)
        const westKnight = {west:this.west(cols[cols.indexOf(column)-1], row, cols).slice(1, 2).toString(), south:this.south(cols[cols.indexOf(column)-1], row, cols).slice(1, 2).toString()};
        const diagonals = {north:northDiags.slice(1), south:southDiags.slice(1), east:eastDiags.slice(1), west:westDiags.slice(1)};
        const boundaryTiles = [northDiags.slice(-1).toString(),southDiags.slice(-1).toString(),eastDiags.slice(-1).toString(), westDiags.slice(-1).toString()];                    
        this.diagonals = diagonals;
        this.boundaries = boundaryTiles;
        this.knightMoves = {up:northKnight, down:southKnight, left:westKnight, right:eastKnight};
    }
    north(column, row, cols){
        const diagonals = [];
        let y = parseInt(row)
        if(y!==8 && typeof column !== "undefined"){
            for(let x=cols.indexOf(column? column:0);x<cols.length;x++){
                if(y <= cols.length){
                    diagonals.push(cols[x]+(y))
                    y++
                }
            }
            return diagonals 
        }else{
            return [column+row]
        }

    }
    south(column, row, cols){
        const diagonals = [];
        let y = parseInt(row)
        if(y!==1 && typeof column !== "undefined"){
            for(let x=cols.indexOf(column? column:0);x>=0;x--){
                if(y>0 && x < cols.length){
                    diagonals.push(cols[x]+(y))
                    y--
                }
            }
            return diagonals
        }else{
            return [column+row]
        }
    }
    east(column, row, cols){
        const diagonals = [];
        let y=parseInt(row)
        if(y!==1 && typeof column !== "undefined"){
            for(let x=cols.indexOf(column? column:0);x<cols.length;x++){
                if(y>0){
                    diagonals.push(cols[x]+(y));
                    y--
                }
            }
            return diagonals
        }else{
            return [column+row]
        }
    }
    west(column, row, cols){
        const diagonals = [];
        let y=parseInt(row)
        if(y!==8 && typeof column !== "undefined"){
            for(let x=cols.indexOf(column? column:0);x>=0;x--){
                if(y<=cols.length){
                    diagonals.push(cols[x]+(y));
                    y++
                }
            }
            return diagonals
        }else{
            return [column+row]
        }
    }
}
class Board {
    constructor(target){
        const setBoardAttribute = [
        { class: 'board container-sm', children: []},
        ];  
        for(const [row, column] of Object.entries(Board.cols)){ 
            const rowSetAttribute = {class: 'board-row row', id: row, children: []};
            this[row] = {};
            for(let i=0;i<Board.cols.length;i++){
                const tile = new Tile(column, i+1);
                this[Board.cols.indexOf(column)][i] = tile
                const tileSetAttribute = { id: tile.position, };
                switch(tile.color){
                    case 'black': tileSetAttribute['class'] = 'col-tile col tile-black'; break
                    case 'white': tileSetAttribute['class'] = 'col-tile col tile-white'; break
                }
                rowSetAttribute.children.push(tileSetAttribute);
            } 
            setBoardAttribute[0].children.push(rowSetAttribute);
        }
        populateNode(setBoardAttribute, null, target);
        console.log(this);
                            
    }
    static cols = ['A','B','C','D','E','F','G','H'];
    createDisplay(){
        const tiles = document.getElementsByClassName('col-tile');
        for(let tile of tiles){
            tile.innerHTML = `<h5>${tile.id}</h5>`;
            tile.addEventListener('mouseenter', (e)=>{
                const thisTile = this[parseInt(e.target.parentElement.id)][parseInt(e.target.id[1]) - 1];
                for(let boundary of thisTile.boundaries){
                    const boundaryTile = document.getElementById(boundary);
                    boundaryTile.style = 'background-color: red;';
                }for(let knightMoveDirection of Object.values(thisTile.knightMoves)){
                    for(let knightMove of Object.values(knightMoveDirection)){
                        const knightMoveTile = document.getElementById(knightMove);
                        if(knightMoveTile) knightMoveTile.style = 'background-color: blue;';
                    }
                }
            });
            tile.addEventListener('mouseleave', (e)=>{
                const thisTile = this[parseInt(e.target.parentElement.id)][parseInt(e.target.id[1]) - 1];
                for(let boundary of thisTile.boundaries){
                    const boundaryTile = document.getElementById(boundary);
                    boundaryTile.style = '';
                }for(let knightMoveDirection of Object.values(thisTile.knightMoves)){
                    for(let knightMove of Object.values(knightMoveDirection)){
                        const knightMoveTile = document.getElementById(knightMove);
                        if(knightMoveTile) knightMoveTile.style = '';
                    }
                }
            });
        }
    }
}
const chessBoard = new Board(document.getElementById('display'));
chessBoard.createDisplay();
function boundaryCheck(direction, currentTile){
    switch(direction){
        case 'north': 
            if(nInput.value.toUpperCase() === currentTile.boundaries[0]){
                nHead.hidden = false;
            }else{
                nHead.hidden = true;
            }break;
        case 'south': 
            if(sInput.value.toUpperCase() === currentTile.boundaries[1]){
                sHead.hidden = false;
            }else{
                sHead.hidden = true;
            }break;
        case 'east': 
            if(eInput.value.toUpperCase() === currentTile.boundaries[2]){
                eHead.hidden = false;
            }else{
                eHead.hidden = true;
            }break;
        case 'west': 
            if(wInput.value.toUpperCase() === currentTile.boundaries[3]){
                wHead.hidden = false;
            }else{
                wHead.hidden = true;
            }break;
    }
}
function getRandomInt(){
    return Math.floor(Math.random() * 8);
}
function getRandomTile(){
    const tile = chessBoard[getRandomInt()][getRandomInt()];
    currentTile = tile;
    console.log(currentTile);
    updateTileDisplay(tile);
}