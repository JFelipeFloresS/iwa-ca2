import  { TableBody } from '../../src/App';

// Functionalities from https://web.dev/drag-and-drop/

console.log("HERE");

/**
 * This function stores the information of the TR that is being dragged into a variable draggedElement and into the DragEvent, 
 * and allows the DragEvent to move the data.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
 function handleDragStart(e) {
    draggedElement = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragged');
};

/**
 * Removes the styling of the currently dragged TR and removes the class over of all previously added elements.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragEnd(e) {
    this.classList.remove('dragged');
    var albums = TableBody();
    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];
        album.classList.remove('over');
    }
};

/**
 * Cancels the default action of the event, preventing the draggedElement from being dropped in the wrong place.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
};

/**
 * Adds the class over to the TR currently being hovered.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragEnter(e) {
    this.classList.add('over');
};

/**
 * Removes the class over from the TR that is no longer being hovered.
 * 
 * @param {DragEvent} e An event thatcontains the information of the drag.
 */
function handleDragLeave(e) {
    this.classList.remove('over');
};


/**
 * Stops the current drag event and places the dragged element where it has been dropped, moving all other items accordingly.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDrop(e) {

    // Stops the current drag event from continuing.
    e.stopPropagation();

    /*
    if (!isTableValid()) {
        return
    }
    */

    // Handles the drop if the draggedElement is not the same as the dropped element.
    if (draggedElement !== this) {

        // Gets the position of both the draggedElement and the droppedElement in the NodeList allAlbums from their position in the chart.
        let dragPos = draggedElement.querySelector('#number').innerHTML - 1;
        let dropPos = this.querySelector('#number').innerHTML - 1;

        // In order to only iterate through the necessary elements in the NodeList, we need a starting and an ending point.
        let minPos = Math.min(dragPos, dropPos);
        let maxPos = Math.max(dragPos, dropPos);

        let draggedInnerHTML = draggedElement.innerHTML;

        var allAlbums = TableBody();
        if (dropPos == minPos) { // Handles the drop above the draggedElement.

            dropElementTop(minPos, maxPos, draggedInnerHTML);

        } else { // Handles the drop underneath the draggedElement.

            let currPos = minPos;
            let nextRow = allAlbums[currPos + 1].innerHTML;

            for (let i = minPos; i <= maxPos; i++) {

                // If it's the last position, then that element will get the draggedElement
                if (currPos == maxPos) {
                    allAlbums[i].innerHTML = draggedInnerHTML;
                } else {
                    allAlbums[i].innerHTML = nextRow;
                }

                // Updates the number of the current element and adjusts it for the next iteration.
                allAlbums[i].querySelector('#number').innerHTML = currPos + 1;
                currPos++;

                // Gets the next TR.
                if (i + 2 <= allAlbums.length - 1) {
                    nextRow = allAlbums[i + 2].innerHTML;
                }

            }
        }

        // Posts update to the server
       // saveEdit();
    }
};

/**
 * Moves all elements below the minPos downwards and places the dragged element on top of them.
 * 
 * @param {Integer} minPos top position
 * @param {Integer} maxPos bottom position
 * @param {DOMString} dropElementInnerHTML dragged element DOMString
 */
function dropElementTop(minPos, maxPos, dropElementInnerHTML) {
    // The iteration occurs backwards (maxPos to minPos).
    if (maxPos > 499) {
        maxPos = 499;
    }
    currPos = maxPos;
    allAlbums = TableBody();
    let nextRow = allAlbums[currPos - 1].innerHTML;

    for (let i = maxPos; i >= minPos; i--) {

        // If it's the last position, then that element will get the draggedElement
        if (currPos == minPos) {
            allAlbums[i].innerHTML = dropElementInnerHTML;
        } else {
            allAlbums[i].innerHTML = nextRow;
        }

        // Updates the number of the current element and adjusts it for the next iteration.
        allAlbums[i].querySelector('#number').innerHTML = currPos + 1;
        currPos--;

        // Gets the next TR
        if (i - 2 >= 0) {
            nextRow = allAlbums[i - 2].innerHTML;
        }

    }
}


/**
 * Adds the event listeners required to drag and drop and delete a table row.
 * 
 * @param {Element} item tr element to add event listeners
 */
function addEventListeners(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
    item.querySelector('#delete-button').addEventListener('click', (e) => { deleteElement(e); });
};

allAlbums = TableBody();
console.log(allAlbums);
// Loop to add the event listeners to each TR
for (let i = 0; i < allAlbums.length; i++) {
    const album = allAlbums[i];
    addEventListeners(album);
}