const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const number_of_circle = Math.floor(Math.random() * 10) + 10;
const itemWidth = viewportWidth /number_of_circle ;
const itemHeight = viewportHeight / number_of_circle;

const haflWidth = itemWidth / 2;
const halfHeight = itemHeight / 2;

const gap = Math.min(itemWidth, itemHeight) * 0.4;
const factor = 0.4;
const numColumns = Math.floor((viewportWidth - 0) / itemWidth);
const numRows = Math.floor((viewportHeight - 0) / itemHeight);
const number_initial_points = Math.floor(numColumns * numRows * Math.random()*0.2)+1;
const tile_array: Rectangle[][] = [];
const lineList: Line[] = [];
let growing_circle_counter = 0;
let TopCircles: Circle[] = [];
let BottomCircles: Circle[] = [];
let gradientTrailCounter = 0;
let gradientLastTile : Rectangle = null;
const maxGradientColors = 20;
//const
//initialize the line list

function get_element(x: number, y: number) {
  return tile_array[y][x];
}

function positiveModulo(dividend: number, divisor: number) {
  let remainder = dividend % divisor;
  if (remainder < 0) {
    remainder += divisor;
  }
  return remainder;
}






function setup() {
  console.log("number of columns and rows are", numColumns, numRows);
  var canvas= createCanvas(viewportWidth, viewportHeight);
  canvas.parent('canvas-container');
  for (let j = 0; j < numRows; j++) {
    tile_array[j] = [];
    for (let i = 0; i < numColumns; i++) {
      tile_array[j][i] = new Rectangle(
        i,
        j,
        max(haflWidth+ (i-1)*(itemWidth+itemWidth/(numRows-2)),0),
        max(halfHeight+ (j-1)*(itemHeight+itemHeight/(numColumns-2)),0),
        itemWidth,
        itemHeight
      );
    }
  }
  for (let n = 0; n < number_initial_points; n++) {
    const i = Math.floor(Math.random() * numColumns);
    const j = Math.floor(Math.random() * numRows);
    console.log("the random i and j are", i, j);
    tile_array[j][i].circle.propagate_while_creating_lines_to_neighbours();}
}

function draw() {
  background(255);
  if (growing_circle_counter == numColumns * numRows) {
    growing_circle_counter +=1;
    tile_array.forEach((row) => {
      row.forEach((rectangle) => {
        if (rectangle.circle.circle_type === 'inner') {
        rectangle.circle.toggle_rect_mode = true;}})})}
  if (growing_circle_counter > numColumns * numRows) {
    handleScrollCircles();}

  // console.log("speed vector of first circle is", tile_array[0][0].circle.velocity);
  tile_array.forEach((row) => {
    row.forEach((rectangle) => {
      rectangle.display();
    });
  });
  lineList.forEach((line) => line.display());
  for (let j = 0; j < numRows; j++) {
    for (let i = 0; i < numColumns; i++) {
      tile_array[j][i].circle.display();
      
    }
  }
}


// event listener for resizing the canvas
window.addEventListener("resize", () => {
  //rerun the entire script
  location.reload();
  
});



function handleScrollCircles() {
  // check if we are scrolling at the top of the page 
if (window.scrollY === 0) {
  
  TopCircles.forEach((circle) => {
  circle.toggle_rect_mode = true;

  });
}
if (window.scrollY + viewportHeight === document.body.scrollHeight) {
  
  BottomCircles.forEach((circle) => {
    circle.toggle_rect_mode = true;
  });

}
}