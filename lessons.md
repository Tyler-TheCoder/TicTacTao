`document.getElementByClassName("className")` will return a collection(like a 1D array) containing all the elements under that className



### line `95~99` :

The HTML cells are flat (index 0–8), but GameBoard.board is 2D (3 rows × 3 cols). You need to convert:

```txt
i	i/3 (row)	i%3 (col)	board position
0	0	         0	         board[0][0]
1	0	         1	         board[0][1]
2	0	         2	         board[0][2]
3	1	         0	         board[1][0]
...	...	         ..         .	...
8	2	         2	         board[2][2]
```
so one loop will access all elements of both the 2D board and the 1D collection cells


# Event Listeners:

when ever an event listener is triggered , the browser automatically inject an event object containing all the infos about the event occured
```
e.target          // the exact element that was clicked
e.currentTarget   // the element the listener is attached to
e.type            // "click", "keydown", "submit", etc.
e.preventDefault()// stops default browser behavior (e.g. form submit)
e.stopPropagation()// stops event from bubbling up to parent elements
e.clientX/clientY // mouse coordinates at time of click
e.key             // which key was pressed (for keyboard events)
e.timeStamp       // when the event occurred
```

