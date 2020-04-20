const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card"); // $ - HTML or query element
if ($card) {
  $card.addEventListener("click", (e) => {
    if (e.target.classList.contains("js-remove")) {
      const id = e.target.dataset.id;

      fetch("/card/remove/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((card) => {
          //console.log(card);
          if (card.courses.length) {
            const html = card.courses
              .map((c) => {
                //формируем массив
                return `
              <tr>
                <th>${c.title}</th>
                <th>${c.count}</th>
                <th>
                    <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
                </th>
              </tr>
              `;
              })
              .join(""); // преобразуем в строку
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Корзина пуста</p>";
          }
        });
    }
  });
}
