const getAuthorIds = (authorIds: string) => {
  return authorIds.split(",").map((item: string) => parseInt(item));
};

export default getAuthorIds;
