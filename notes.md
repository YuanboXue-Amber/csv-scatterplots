standard way of updating elements with new data

Use exit enter merge [[ref]](https://bost.ocks.org/mike/join/)
```javascript
var circle = svg.selectAll("circle")
  .data(data); // if there were more elements than data, those excessive elements became null

circle.exit().remove(); // remove excessive

circle.enter().append("circle") // if there were more data than elements, add new data
    .attr("r", 2.5) // changes needed only for these new elements
  .merge(circle) // combination of enter-update, meaning all datas, existing and new
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
```

Or put it in join [[ref]](https://observablehq.com/@d3/selection-join)
```javascript
svg.selectAll("text")
      .data(randomLetters(), d => d) // set each data itself as key for finding element
      .join(
        enter => enter.append("text")
            .attr("fill", "green")
            .attr("x", (d, i) => i * 16)
            .attr("y", -30) // added element to appear on top
            .text(d => d)
          .call(enter => enter.transition(t)
            .attr("y", 0)), // then drop to main display
        update => update
            .attr("fill", "black")
            .attr("y", 0) // updated element appear on its original x position
          .call(update => update.transition(t)
            .attr("x", (d, i) => i * 16)), // then transite to the correct x position (move left or right)
        exit => exit
            .attr("fill", "brown")
          .call(exit => exit.transition(t)
            .attr("y", 30) // deleted element drop below its original position
            .remove()) // then get removed
      );
```
---------------------------------

Nest selection
[[ref]](https://bost.ocks.org/mike/nest/)

1. Nested selection with **index**

```javascript
var td = d3.selectAll("tbody tr").selectAll("td");
// return something like this
// (4) [Array(4), Array(4), Array(4), Array(4)]
// 0: (4) [td, td, td, td, parentNode: tr] col 0-3 of row 0
// 1: (4) [td, td, td, td, parentNode: tr]
// 2: (4) [td, td, td, td, parentNode: tr]
// 3: (4) [td, td, td, td, parentNode: tr]

// color the first column (i==0) red
td.style("color", function(d, i, j) {
  // i is column index (td), j is row index (tr)
  return i ? null : "red";
});
```

2. Assign data to nested selection

```javascript
var matrix = [
  [ 0,  1,  2,  3],
  [ 4,  5,  6,  7],
  [ 8,  9, 10, 11],
  [12, 13, 14, 15],
];
// To join the numbers to the corresponding table cells,
// first join the outer array (matrix) to the rows,
// and then join the inner arrays (matrix[0], matrix[1], …) to the cells:
var td = d3.selectAll("tbody tr")
    .data(matrix)
  .selectAll("td")
    .data(function(d, i) { return d; }); // d is matrix[i]
```

3. Nested selection's parent node

Nesting selections sets the parent node for each group.

But on the other hand, calling select **preserves** the **data**, **index** and even the **parent node** of the original selection.

For example, the following selection is flat, with the parent node still the document root:
```javascript
var td = d3.selectAll("tbody tr").select("td");
```
The only way to obtain a nested selection, then, is to call selectAll on an existing selection; this is why a data-join typically follows a selectAll rather than select.