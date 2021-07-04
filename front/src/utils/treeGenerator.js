import { Tree } from ".";

export default (perks) => {
  if (!perks) return null;
  let tree = null;
  if (perks.length > 0) {
    tree = new Tree(perks[0]);
    perks.forEach((perk, i) => {
      if (i !== 0) tree.add(perks[i], perks[perk.parentIndex]);
    });
    return tree;
  } else {
    return null;
  }
};
