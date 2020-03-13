standard way of updating elements with new data

- Use exit enter merge [[ref]](https://bost.ocks.org/mike/join/)
```javascript
var circle = svg.selectAll("circle")
  .data(data); // if there were more elements than data, those excessive elements became null

circle.exit().remove(); // remove excessive

circle.enter().append("circle") // if there were more data than elements, add new data
    .attr("r", 2.5) // changes needed only for these new elements
  .merge(circle) // combine enter and update, meaning all datas, existing and new
  // Actually, after calling `circle.enter().append()`, the update group is `circle` itself
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
```

- Or put it in join [[ref]](https://observablehq.com/@d3/selection-join)
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

---------------------------------

## svg
[[ref]](https://vizhub.com/curran/366c38ba5ebc4631b4bd936f3b709744)

Difference between `line` and `path`
- when `path` connect, the connecting point is customizable by `stroke-linejoin`.
---------------------------------

## d3

- Bar chart [[ref]](https://vizhub.com/curran/dd44f8fcdc8346ff90bddd63572bf638)

  1. When *domain* is mapped to *range* for `scaleBand`, it is using the left/top most edge of the band. [[ref]](https://vizhub.com/curran/9247d4d42df74185980f7b1f7504dcc5)
![band scale](https://raw.githubusercontent.com/d3/d3-scale/master/img/band.png)

  2. It's good to use `key => Object.key`, value accessors, so we can change the chart to show different columns easier.

- Axis [[ref]](https://vizhub.com/curran/a44b38541b6e47a4afdd2dfe67a302c5)

  1. [Format number example](http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e)
  2. [The Sunlight Foundation’s Data Visualization Style Guidelines](https://github.com/amycesal/dataviz-style-guide/blob/master/Sunlight-StyleGuide-DataViz.pdf)

- Line and Area [[ref]](https://vizhub.com/curran/012b5b20ce894b0fa7dc98ef3a0b43a5)
  - Groups written in the later part of js/ts will be displayed on top layer.

- call [[ref]](https://vizhub.com/curran/92c34f62c0f948e89e87d28907c08715)

  I have a function `myfunc(selection, props){}`

  And this invoking `myfunc(svg, {})` is the same as `svg.call(myfunc, {})`

- `scaleXXX().domain(myArray)` will automatically remove the duplicates in `myArray`
[[ref]](https://vizhub.com/curran/d5ad96d1fe8148bd827a25230cc0f083)