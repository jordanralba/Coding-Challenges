const testItems = [
{name: 'Nacho Cheese', brand: 'Doritos', price: '2.99', position: '03', stock:14},
{name: 'Spicy Sweet Chile', brand: 'Doritos', price: '2.99',stock:3},
{name: 'Classic', brand: 'Frito Lays', price: '1.59',stock:10},
{name: 'Cheddar and Sour Cream', brand: 'Frito Lays', price: '4.29',stock:7}
]
   
class Item {
    constructor({name, brand, price, position, stock}){
        this.name = name;
        this.brand = brand;
        this.price = parseFloat(price);
        this.position = position;
        this.stock = stock;
    }
}

class VendingMachine{
    constructor([rows, columns]){
        this.dimensions = [rows, columns]
        //Create a 2D array representing the shelf space
        for(let i=0;i<rows;i++){
            this[i] = []
            for(let i1=0;i1<columns;i1++){
                this[i].push('Empty')
            }  
        }
    }
    //Track position of the last item added
    lastItemPosition = [0,0];
    //Fill slots on the shelf with Item objects
    addItems(items = []){
        for(let item of items){
            //Destructure the arrays to localize the variables for easy use (and improved speed)
            let [lastPosX, lastPosY] = this.lastItemPosition;
            const {position} = item;

            let desiredPos,
                newPosX = parseInt(lastPosX)+1,
                newPosY = parseInt(lastPosY)+1;
            //Using desiredPos as a temporary value to store the details about whether the slot is empty
            if (position) desiredPos = this[position[0]][position[1]]
            
            //Will be a string if 'Empty'
            if(typeof desiredPos === 'string'){
                this[position[0]][position[1]] = new Item(item);
                //Change lastItemPosition to reflect the empty spot now being occupied
                this.lastItemPosition = [position[0], position[1]]
            }else{
                //If we are still within the bounds of a row defined on initialization
                    //i.e. The next slot is less than the amount of slots in a row 
                if(newPosY < this.dimensions[1]){
                    //Then stay on this row (lastPosX) but move to the next slot (newPosY) and add the Item
                    this[lastPosX][newPosY] = new Item(item);
                    this.lastItemPosition = [lastPosX, newPosY]
                }
                //If the next slot is outside the bounds
                    //i.e. The next slot is greater than the amount of slots
                    //AND The next row exists
                else if(newPosY >= this.dimensions[1] && newPosX < this.dimensions[0]){
                    //Then start at the beginning
                    newPosY = 0;  
                    //and add the Item
                    this[newPosX][newPosY] = new Item(item);
                    this.lastItemPosition = [newPosX, newPosY]
                }else {
                    console.error("All slots are filled")
                } 
            }          
        }
    }
    //Remove Item and all it's stock from shelf and replace with a new item (defaults empty)
    removeItems([x, y], replaceWith = 'Empty'){ 
        if(typeof this[x][y] !== 'undefined' && replaceWith != 'Empty'){
            this[x][y] = new Item(replaceWith);
            return;
        }
        this[x][y] = replaceWith;
        
    }
    //Tracks total customer funds on vending machine
    balance = 0;
    addMoney(amount){
        this.balance += amount;
    }
    //Empties the balance and returns to customer
    retrieveMoney(){
        let returnBalance = this.balance;
        this.balance = 0;
        return returnBalance;
    }
    //Tracks total earned from purchased items
    profit = 0;
    buyItem([x, y]){
        //If there's an Item in the input position
        if(typeof this[x][y] === 'object'){
            let {price, stock} = this[x][y];
            if(stock <= 0){
                console.error("Out of Stock")
                return
            }
            if(this.balance < price){
                console.error("Insufficient Balance. Item Cost: "+price)
                return
            }
            //Subtract the purchased Item's cost 
            this.balance -= price;
            //Reflect the transaction
            this.profit += price;
            this[x][y].stock -= 1;
            //Uncomment to clear from shelf if stock reaches 0
            /*if(this[x][y].stock == 0){
                this.removeItems(`${x}${y}`);
            }*/ 
        }
        else{
            console.error(`Empty slot at: ${x}${y}`)
        }
    }
}
const vendingMachine = new VendingMachine([3,2]);
vendingMachine.addItems(testItems);
console.log(vendingMachine);

//This was the starting point (what was done in the interview)
/*const vendingMachine = [],
items = [
    {name: 'Nacho Cheese', brand: 'Doritos', price: '2.99', position: 'a1'},
    {name: 'Spicy Sweet Chile', brand: 'Doritos', price: '2.99', position: 'a1'},
    {name: 'Classic', brand: 'Frito Lays', price: '1.59', position: 'a1'},
    {name: 'Cheddar and Sour Cream', brand: 'Frito Lays', price: '4.29', position: 'a1'},
]



class Item {
    constructor(name, price, position){
        this.name = name;
        this.price = parseFloat(price);
        this.position = position;
    }
}

class VendingMachine{
    selectItem(position){
        return this['position']
    }
}
*/