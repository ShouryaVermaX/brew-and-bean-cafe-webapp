// Brew & Bean Cafe - script.js (used by menu.html and contact.html)

// ---------- DATA ----------

// Menu items: an array of objects (id, name, category, price)
const items = [
  { id: 1,  name: "Espresso",         category: "Coffee",   price: 120 },
  { id: 2,  name: "Cappuccino",       category: "Coffee",   price: 150 },
  { id: 3,  name: "Latte",            category: "Coffee",   price: 160 },
  { id: 4,  name: "Cold Coffee",      category: "Coffee",   price: 140 },
  { id: 5,  name: "Veg Sandwich",     category: "Snacks",   price: 110 },
  { id: 6,  name: "French Fries",     category: "Snacks",   price: 90 },
  { id: 7,  name: "Garlic Bread",     category: "Snacks",   price: 100 },
  { id: 8,  name: "Veg Burger",       category: "Snacks",   price: 130 },
  { id: 9,  name: "Brownie",          category: "Desserts", price: 120 },
  { id: 10, name: "Cheesecake",       category: "Desserts", price: 170 },
  { id: 11, name: "Chocolate Pastry", category: "Desserts", price: 110 },
  { id: 12, name: "Waffle",           category: "Desserts", price: 140 }
];

// Flavours (radio buttons) and toppings (checkboxes) for each category
const flavours = {
  Coffee: ["Vanilla", "Caramel", "Hazelnut"],
  Snacks: ["Regular", "Spicy", "Cheesy"],
  Desserts: ["Chocolate", "Strawberry", "Vanilla"]
};
const toppings = {
  Coffee: ["Whipped Cream", "Extra Shot", "Choco Syrup"],
  Snacks: ["Extra Cheese", "Mayo Dip", "Peri Peri"],
  Desserts: ["Ice Cream", "Nuts", "Chocolate Sauce"]
};
const toppingPrice = 20;   // each topping costs 20 rupees

// The cart is an array. localStorage (browser API) keeps it saved after a refresh.
let cart = [];
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
}


// ---------- MENU PAGE ----------

// Shows the menu cards for the selected category
function showMenu() {
  const selected = document.querySelector('input[name="category"]:checked').value;
  let html = "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (selected == "All" || selected == item.category) {
      html += '<article class="card"><h3>' + item.name + '</h3><p class="price">₹' + item.price + "</p>";

      // Radio buttons: only one flavour can be selected
      html += "<p><b>Flavour:</b></p>";
      const f = flavours[item.category];
      for (let j = 0; j < f.length; j++) {
        let checked = "";
        if (j == 0) {
          checked = "checked";   // first flavour is selected by default
        }
        html += '<label><input type="radio" name="flavour' + item.id + '" value="' + f[j] + '" ' + checked + "> " + f[j] + "</label>";
      }

      // Checkboxes: many toppings can be selected
      html += "<p><b>Extra toppings (+₹" + toppingPrice + " each):</b></p>";
      const t = toppings[item.category];
      for (let j = 0; j < t.length; j++) {
        html += '<label><input type="checkbox" name="topping' + item.id + '" value="' + t[j] + '"> ' + t[j] + "</label>";
      }

      html += '<button class="add-btn" onclick="addToCart(' + item.id + ')">Add to Cart</button></article>';
    }
  }
  document.getElementById("menu-list").innerHTML = html;   // put the cards on the page
}

// Adds the chosen item, flavour and toppings to the cart
function addToCart(id) {
  const item = items[id - 1];   // ids start at 1, the array starts at 0
  const flavour = document.querySelector('input[name="flavour' + id + '"]:checked').value;
  const boxes = document.querySelectorAll('input[name="topping' + id + '"]:checked');

  const chosen = [];
  for (let i = 0; i < boxes.length; i++) {
    chosen.push(boxes[i].value);
  }

  // price = item price + (number of toppings x topping price)
  cart.push({ name: item.name, flavour: flavour, toppings: chosen, price: item.price + chosen.length * toppingPrice });
  showCart();
}

// Shows the cart list and the total
function showCart() {
  let html = "";
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].price;
    let toppingText = "No toppings";
    if (cart[i].toppings.length > 0) {
      toppingText = cart[i].toppings.join(", ");   // join() makes one text from the array
    }
    html += "<li><b>" + cart[i].name + "</b> (" + cart[i].flavour + ", " + toppingText + ") - ₹" + cart[i].price;
    html += ' <button class="remove-btn" onclick="removeItem(' + i + ')">Remove</button></li>';
  }
  if (cart.length == 0) {
    html = "<li>Your cart is empty.</li>";
  }

  document.getElementById("cart-items").innerHTML = html;
  document.getElementById("cart-total").innerHTML = total;
  localStorage.setItem("cart", JSON.stringify(cart));   // save the cart in the browser
}

function removeItem(index) {
  cart.splice(index, 1);   // delete 1 item at this position
  showCart();
}

function placeOrder() {
  const msg = document.getElementById("order-msg");
  if (cart.length == 0) {
    msg.innerHTML = "Your cart is empty. Please add items first.";
  } else {
    msg.innerHTML = "Thank you! Your order of ₹" + document.getElementById("cart-total").innerHTML + " has been placed.";
    cart = [];
    showCart();
  }
}


// ---------- CONTACT PAGE ----------

function checkForm() {
  const name = document.getElementById("fullname").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  let ok = true;

  // Clear old messages
  document.getElementById("name-error").innerHTML = "";
  document.getElementById("phone-error").innerHTML = "";
  document.getElementById("email-error").innerHTML = "";

  if (name.length < 3) {
    document.getElementById("name-error").innerHTML = "Name must have at least 3 letters.";
    ok = false;
  }
  if (phone.length != 10 || isNaN(phone)) {   // isNaN() is true if it is not a number
    document.getElementById("phone-error").innerHTML = "Enter a 10 digit phone number.";
    ok = false;
  }
  if (email.indexOf("@") == -1) {             // indexOf() gives -1 if @ is not found
    document.getElementById("email-error").innerHTML = "Enter a valid email address.";
    ok = false;
  }

  if (ok == true) {
    document.getElementById("form-message").innerHTML = "Thank you, " + name + "! We received your message.";
    document.getElementById("contact-form").reset();
  }
  return false;   // false stops the page from reloading
}


// ---------- RUN WHEN THE MENU PAGE LOADS ----------
if (document.getElementById("menu-list")) {
  showMenu();
  showCart();
}
