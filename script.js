document.addEventListener('DOMContentLoaded', function () {
    // Wait for the DOM content to be fully loaded before executing the script

    const animationSection = document.querySelector('.animation-section');
    // Get the reference to the HTML element with the class 'animation-section'

    const gridSize = 40; // Adjust the size of the grid
    const nodeSize = 20; // Adjust the size of each node
    const propagationSpeed = 100; // Adjust the speed of propagation (milliseconds)

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
        // Function to create connections between nodes at coordinates (x, y)

        const adjacentPositions = [
            { offsetX: -1, offsetY: 0 },
            { offsetX: 1, offsetY: 0 },
            { offsetX: 0, offsetY: -1 },
            { offsetX: 0, offsetY: 1 },
        ];
        // Define possible adjacent positions relative to the current node
        let newPoints = [];
        adjacentPositions.forEach((pos) => {
            // Iterate through each adjacent position
            const newX = x + pos.offsetX;
            const newY = y + pos.offsetY;
            //initialize array to store new points
            
            if (newX >= 0 && newY >= 0 && newX < gridSize && newY < gridSize) {
                // Check if the adjacent position is within the grid boundaries
                const neighbor = animationSection.querySelector(`.node[data-x="${newX}"][data-y="${newY}"]`);
                // Get the neighboring node at the adjacent position

                if (!neighbor) {
                    // If a neighboring node exists
                    setTimeout(() => {
                        // Introduce a time delay before creating the connection line
                        const node = document.createElement('div');
                        node.classList.add('node');
                        // Create a new <div> element for the connection line
                        node.style.left = `${newX *(nodeSize + 5) }px`;
                        node.style.top = `${newY *(nodeSize + 5)}px`;
                        // node.style.width = `${pos.offsetX !== 0 ? nodeSize : 1}px`;
                        // node.style.height = `${pos.offsetY !== 0 ? nodeSize : 1}px`;
                        // Set styles for the connection line based on the direction
                        animationSection.appendChild(node);
                        newPoints.push({x: newX, y: newY});
                        // Append the connection line to the animation section
                    }, propagationSpeed);
        
                    // Time delay specified by the propagationSpeed variable
                }
            }
        });
        console.log("New Points Inside: ", newPoints);
        return newPoints;
    }

    function animateNodes() {
        let col = Math.floor(Math.random() * gridSize);
        let row = Math.floor(Math.random() * gridSize);
    
        const node = createNode(col, row);
        const posX = col * (nodeSize + 5);
        const posY = row * (nodeSize + 5);
        node.style.left = `${posX}px`;
        node.style.top = `${posY}px`;
        animationSection.appendChild(node);
    
        // Initialize pointQueue as an array
        let pointQueue = [{ x: col, y: row }];
    
        while (pointQueue.length > 0) {
            let currentPoint = pointQueue.pop();
            col = currentPoint.x;
            row = currentPoint.y;
    
            // Initialize newPoints as an array
            let newPoints = connectNodes(col, row);
    
            // Check if newPoints is iterable
            if (newPoints && typeof newPoints[Symbol.iterator] === 'function') {
                console.log("in the if condition")
                // Spread the iterable newPoints into pointQueue
                console.log("Concate: ", pointQueue.concat(newPoints),pointQueue, newPoints );
                pointQueue=pointQueue.concat(newPoints);
            }
            console.log("New points is iterable: ", typeof newPoints[Symbol.iterator] === 'function');
            console.log("New Points outside: ", newPoints, "Point Queue: ", pointQueue);
        }
    }

    animateNodes();
    // Call the animateNodes function to start the animation
});
