document.addEventListener('DOMContentLoaded', function () {
    // Wait for the DOM content to be fully loaded before executing the script

    const animationSection = document.querySelector('.animation-section');
    // Get the reference to the HTML element with the class 'animation-section'

    const gridSize = 20; // Adjust the size of the grid
    const nodeSize = 20; // Adjust the size of each node
    const propagationSpeed = 20; // Adjust the speed of propagation (milliseconds)

    function createNode(x, y) {
        // Function to create a new node with specified coordinates (x, y)
        const node = document.createElement('div');
        // Create a new <div> element
        node.classList.add('node');
        // Add the 'node' class to the new element
        node.dataset.x = x;
        node.dataset.y = y;
        // Set custom data attributes 'data-x' and 'data-y' with the provided coordinates
        return node;
    }

    function connectNodes(x, y) {
        return new Promise((resolve) => {
            const adjacentPositions = [
                { offsetX: -1, offsetY: 0 },
                { offsetX: 1, offsetY: 0 },
                { offsetX: 0, offsetY: -1 },
                { offsetX: 0, offsetY: 1 },
            ];
    
            let newPoints = [];
            let count = 0;
    
            adjacentPositions.forEach((pos) => {
                const newX = x + pos.offsetX;
                const newY = y + pos.offsetY;
                
                if (newX >= 0 && newY >= 0 && newX < gridSize && newY < gridSize && animationSection.childNodes.length < gridSize * gridSize) {
                    const neighbor = animationSection.querySelector(`.node[data-x="${newX}"][data-y="${newY}"]`);
                    console.log("Neighbor: ", neighbor, "number of childnodes: ", animationSection.childNodes.length ); 
                    if (!neighbor) {
                        setTimeout(() => {
                            const node = createNode(newX, newY);
                            
                            node.style.left = `${newX * (nodeSize + 5)}px`;
                            node.style.top = `${newY * (nodeSize + 5)}px`;
                            animationSection.appendChild(node);
                            newPoints.push({ x: newX, y: newY });
    
                            count++;
                            if (count === adjacentPositions.length) {
                                // Resolve the promise when all asynchronous tasks are complete
                                resolve(newPoints);
                            }
                        }, propagationSpeed);
                    } else {
                        count++;
                        if (count === 4) {
                            // Resolve the promise when all asynchronous tasks are complete
                            resolve(newPoints);
                        }
                    }
                } else {
                    count++;
                    if (count === 4) {
                        // Resolve the promise when all asynchronous tasks are complete
                        resolve(newPoints);
                    }
                }
            });
        });
    }
    
    async function animateNodes() {
        let col = Math.floor(Math.random() * gridSize);
        let row = Math.floor(Math.random() * gridSize);
    
        const node = createNode(col, row);
        console.log("Node: ", node , "and its dataset attributes: ", node.dataset.x, node.dataset.y);
        const posX = col * (nodeSize + 5);
        const posY = row * (nodeSize + 5);
        node.style.left = `${posX}px`;
        node.style.top = `${posY}px`;
        animationSection.appendChild(node);
    
        let pointQueue = [{ x: col, y: row }];
    
        while (pointQueue.length > 0) {
            let currentPoint = pointQueue.pop();
            col = currentPoint.x;
            row = currentPoint.y;
    
            let newPoints = await connectNodes(col, row);
    
            pointQueue.push(...newPoints);
    
            // console.log("New Points outside: ", newPoints, "Point Queue: ", pointQueue);
        }
    }
    

    animateNodes();
    // Call the animateNodes function to start the animation
});
