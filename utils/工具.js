export function flatten(array = []) {
  let res = [];
  array.map((item) => {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item));
    } else {
      res.push(item);
    }
  });
  return res;
};