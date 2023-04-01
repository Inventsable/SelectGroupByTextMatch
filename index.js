Array.prototype.filter = function (callback) {
  var filtered = [];
  for (var i = 0; i < this.length; i++)
    if (callback(this[i], i, this)) filtered.push(this[i]);
  return filtered;
};
Array.prototype.forEach = function (callback) {
  for (var i = 0; i < this.length; i++) callback(this[i], i, this);
};
Array.prototype.map = function (callback) {
  var mappedParam = [];
  for (var i = 0; i < this.length; i++)
    mappedParam.push(callback(this[i], i, this));
  return mappedParam;
};
function get(type, parent, deep) {
  if (arguments.length == 1 || !parent) {
    parent = app.activeDocument;
    deep = true;
  }
  var result = [];
  if (!parent[type]) return result;
  for (var i = 0; i < parent[type].length; i++) {
    result.push(parent[type][i]);
    if (parent[type][i][type] && deep)
      result = [].concat(result, get(type, parent[type][i], deep));
  }
  return result;
}

function getNearestGroupParent(item) {
  if (!item.parent) return null;
  return /group/i.test(item.parent.typename)
    ? item.parent
    : getNearestGroupParent(item.parent) || null;
}
function isValidGroup(item) {
  return item && /group/i.test(item.typename);
}

app.selection = null;
var input = prompt("Enter comma separated text to select", ["3454", "3457"]);
var rx = new RegExp("(" + input.split(",").join("|") + ")");
var results = get("textFrames")
  .filter(function (textFrame) {
    return rx.test(textFrame.contents);
  })
  .map(function (textFrame) {
    return getNearestGroupParent(textFrame);
  });

if (!results.length) alert("No result found for " + input);
else
  results.forEach(function (group) {
    if (isValidGroup(group)) group.selected = true;
  });
