/**
 *
 * @param {any[]} list
 */
function switch_gravity(list) {
  let rowLength = list[0].length;
  let sorted = [];
  let output;

  for (let i = 0; i < rowLength; i++) {
    let col = list.map((item) => item[i]).sort((a, b) => a.localeCompare(b));
    sorted.push(col);
  }
  output = [...sorted];

  for (let i = 0; i < sorted.length; i++) {
    for (let j = 0; j < sorted[0].length; j++) {
      output[j][i] = sorted[i][j];
    }
  }

  console.log(output);
}

console.log(
  switch_gravity([
    ["-", "#", "#", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
  ])
);

let arr = [
  [2, 5],
  [5, 3],
  [6, 4],
];
console.log(arr[2][1]);
