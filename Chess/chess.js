/*const horizontal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const square = {}
let x = 1;
function createRow(){
    const row = [];
    for(column of horizontal){
        column += x;
        x++;
        row.push(column);
    }
    console.log(row);
}
createRow();*/
const horizontal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
function createRow(){
    const board = {};
    for(i=0;i<horizontal.length;i++){
        const row = []
        row.push(horizontal.join(i+1+', ')+(i+1));
        board[i+1] = row;
    }
    console.log(board);
}
createRow();
