// Define callback function to return filtered items (filtered according to search bar and filter markers)
const filterItem = (item, findFilter, user) => {
  return (
    ((findFilter.islost && item.islost) ||
      (findFilter.isFound && !item.islost)) &&
    (findFilter.type === "everything" || findFilter.type === item.type) &&
    (findFilter.uploadDate === "" ||
      (item.itemDate && item.itemDate.includes(findFilter.uploadDate))) &&
    (!findFilter.isYourPosts || item.email === user.email) &&
    (findFilter.isShowReturned || !item.isresolved)
  );
};

export { filterItem };
