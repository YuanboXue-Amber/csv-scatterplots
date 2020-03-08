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
