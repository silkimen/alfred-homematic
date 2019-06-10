module.exports = { getDeviceList };

function normalizeToCompare(text) {
  return text.normalize().toLowerCase();
}

function getMatching(items, query) {
  return items.filter(
    item => normalizeToCompare(item.key).startsWith(normalizeToCompare(query))
  );
}

function getExactlyMatching(items, query) {
  return items.find(
    item => normalizeToCompare(item.key) === normalizeToCompare(query)
  );
}

function mapItems(items, path) {
  return items.map(item => ({
    title: item.key,
    autocomplete: path.concat(item.key).concat('').join(' '),
    valid: !item.items,
    arg: item.cmd
  }));
}

function getDeviceList(items, path, left, right) {
  if (!items) return [];

  left += right.charAt(0);
  right = right.slice(1);

  const matching = getMatching(items, left);
  const exact = getExactlyMatching(items, left);

  if (right.length > 0) {
    if (exact) {
      return getDeviceList(exact.items, path.concat(exact.key), '', right.slice(1));
    }

    if (matching) {
      return getDeviceList(items, path, left, right);
    }
  }

  return mapItems(matching, path);
}
