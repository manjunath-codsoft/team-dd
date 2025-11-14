// ---------- Utility Functions -----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document
    .querySelectorAll(".btn-cart-count")
    .forEach((btn) => (btn.textContent = `Cart (${count})`));
}

// ---------- Add to Cart (products.html) ----------
if (document.querySelectorAll(".btn-add-to-cart").length) {
  document.querySelectorAll(".btn-add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = btn.closest(".product-card");
      const pname = card.querySelector(".card-title").textContent;
      const price = parseInt(
        card.querySelector(".product-price").textContent.replace(/\D/g, "")
      );
      const img = card.querySelector("img").src;
      let cart = getCart();
      let item = cart.find((i) => i.name === pname);
      if (item) {
        item.qty += 1;
      } else {
        cart.push({ name: pname, price: price, img: img, qty: 1 });
      }
      saveCart(cart);
      updateCartCount();
      btn.textContent = "Added!";
      setTimeout(() => (btn.textContent = "Add to Cart"), 800);
    });
  });
}

// ---------- Cart Page Interaction (cart.html) ----------
if (document.getElementById("cart-table-body")) {
  function renderCart() {
    let cart = getCart();
    let tbody = document.getElementById("cart-table-body");
    tbody.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">Cart is empty.</td></tr>`;
    } else {
      cart.forEach((item, idx) => {
        let row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${item.img}" class="rounded" style="width: 65px;"></td>
          <td>${item.name}</td>
          <td>₹${item.price}</td>
          <td><input type="number" min="1" value="${
            item.qty
          }" class="form-control form-control-sm bg-dark text-light cart-qty-input" data-idx="${idx}" style="width:65px;"></td>
          <td>₹${item.price * item.qty}</td>
          <td><button class="btn btn-sm btn-danger btn-remove" data-idx="${idx}">Remove</button></td>
        `;
        tbody.appendChild(row);
        total += item.price * item.qty;
      });
    }
    document.getElementById("cart-total-amt").textContent = "₹" + total;
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-remove")) {
      let idx = +e.target.dataset.idx;
      let cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("cart-qty-input")) {
      let idx = +e.target.dataset.idx;
      let cart = getCart();
      let val = Math.max(1, parseInt(e.target.value) || 1);
      cart[idx].qty = val;
      saveCart(cart);
      renderCart();
      updateCartCount();
    }
  });

  // on first load
  renderCart();
  updateCartCount();
}

// ---------- Cart Count on All Pages ----------
document.addEventListener("DOMContentLoaded", updateCartCount);
