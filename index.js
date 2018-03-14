var m = require('makerjs');
const hole_size = 0.165;
const post_size = 0.25;
const plate_min_margin = 0.1;

const plate_width = 8;
const plate_height = 8;

function getLine(margin, width) {
  let line = {paths:{}};
  let cur_name = 1;
  let x = 0;
  while(x < (width - (margin*2))) {
    line.paths[cur_name] = new m.paths.Circle([x,0],hole_size/2);
    cur_name++;
    x = x + post_size;
  }
  return line;
}

function getGrid(margin, width, height) {
  let grid = {models:{}};
  let y = 0;
  let row_name = 1;
  while(y < (height - (margin*2))) {
    line = getLine(margin, width);
    if(row_name % 2 == 0) {
      delete line.paths[1];
      line.origin = [-(post_size/2), y];
    } else {
      line.origin = [0, y];
    }
    grid.models[row_name] = line;
    row_name++;
    y = y + Math.sqrt(Math.pow(post_size,2) - Math.pow(post_size/2,2));
  }
  let num_holes = Object.keys(grid.models["1"].paths).length;
  let center_to_center_line_width = (num_holes - 1) * post_size;
  let line_width = center_to_center_line_width + hole_size;
  let xoffset = (plate_width - line_width)/2 + hole_size/2;

  let line_height = grid.models[row_name-1].origin[1] + hole_size;
  let yoffset = (plate_height - line_height)/2 + hole_size/2;

  grid.origin=[xoffset,yoffset];
  return grid;
}

var model = {
  units:m.unitType.Inch,
  models: {
    plate: new m.models.Rectangle(plate_width,plate_height),
    grid: getGrid(plate_min_margin, plate_width, plate_height)
  },
};

console.log(m.exporter.toDXF(model));
