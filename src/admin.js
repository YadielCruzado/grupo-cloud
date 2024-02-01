const listItems = document.querySelectorAll(".list-group-item");

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    const itemId = item
      .querySelector("span")
      .textContent.toLowerCase()
      .replace(" ", "-");
    const content = document.querySelector(`#content-${itemId}`);
    content.style.display = "block";

    listItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        const otherItemId = otherItem
          .querySelector("span")
          .textContent.toLowerCase()
          .replace(" ", "-");
        const otherContent = document.querySelector(`#content-${otherItemId}`);
        otherContent.style.display = "none";
      }
    });

    item.classList.add("active");
  });
});
