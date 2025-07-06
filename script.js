let users = [
  { id: "70062", name: "Musab Ali", role: "admin", site: "مسلخ غياثي" },
  { id: "200", name: "مستخدم1", role: "user", site: "مسلخ مدينة" }
];

let sites = ["مسلخ غياثي", "مسلخ مدينة"];
let animals = ["خروف", "ماعز", "بقر", "جمل"];
let cuttings = ["عزيمة", "ثلاجة"];
let prices = {};
let invoices = [];
let currentUser = null;
let invoiceCounter = 1;

// شعار
let logoData = localStorage.getItem("logoData");
if (logoData) {
  document.getElementById("logoSplash").src = logoData;
}

// تطبيق اللون
let savedColor = localStorage.getItem("themeColor");
if (savedColor) {
  document.documentElement.style.setProperty('--main-color', savedColor);
  document.getElementById("themeColorPicker").value = savedColor;
}

// تشغيل
window.onload = () => {
  showSection("splash");
  setTimeout(() => showSection("login"), 2000);
  updateClock();
  setInterval(updateClock, 1000);
  populateInitialData();
  document.getElementById("logoUploader").addEventListener("change", uploadLogo);
  document.getElementById("themeColorPicker").addEventListener("change", e => {
    let color = e.target.value;
    document.documentElement.style.setProperty('--main-color', color);
    localStorage.setItem("themeColor", color);
  });
};

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = `${now.toLocaleDateString("ar-EG")} ${now.toLocaleTimeString("ar-EG", { hour12: false })}`;
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function populateInitialData() {
  fillSelect("priceAnimal", animals);
  fillSelect("priceCutting", cuttings);
  fillSelect("animalType", animals);
  fillSelect("cuttingType", cuttings);
  fillSelect("animalNumber", Array.from({ length: 50 }, (_, i) => i + 1));
  fillSelect("stickerNumber", Array.from({ length: 100 }, (_, i) => i + 1));
  fillSelect("quantity", Array.from({ length: 50 }, (_, i) => i + 1));
  refreshUsersTable();
  refreshSitesList();
  refreshAnimalsList();
  refreshCuttingsList();
  updateInvoiceNumber();
}

function fillSelect(id, items) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function updateInvoiceNumber() {
  document.getElementById("invoiceNumber").value = invoiceCounter.toString().padStart(5, "0");
}

function login() {
  const empId = document.getElementById("employeeId").value.trim();
  const user = users.find(u => u.id === empId);
  if (!user) return alert("المستخدم غير موجود");
  currentUser = user;
  document.getElementById("username").textContent = currentUser.name;
  setupDataEntrySite();
  showSection("dashboard");
}

function setupDataEntrySite() {
  const title = document.getElementById("dataEntrySiteTitle");
  title.textContent = currentUser.role === "admin"
    ? "كل المواقع متاحة"
    : `الموقع: ${currentUser.site}`;
}

function logout() {
  currentUser = null;
  showSection("login");
}

function addSite() {
  const site = document.getElementById("newSite").value.trim();
  if (site && !sites.includes(site)) {
    sites.push(site);
    refreshSitesList();
    document.getElementById("newSite").value = "";
  }
}

function refreshSitesList() {
  const list = document.getElementById("sitesList");
  list.innerHTML = "";
  sites.forEach(site => {
    const li = document.createElement("li");
    li.textContent = site;
    list.appendChild(li);
  });
  fillSelect("newUserSite", sites);
}

function addAnimal() {
  const animal = document.getElementById("newAnimal").value.trim();
  if (animal && !animals.includes(animal)) {
    animals.push(animal);
    fillSelect("priceAnimal", animals);
    fillSelect("animalType", animals);
    refreshAnimalsList();
    document.getElementById("newAnimal").value = "";
  }
}

function refreshAnimalsList() {
  const list = document.getElementById("animalsList");
  list.innerHTML = "";
  animals.forEach(animal => {
    const li = document.createElement("li");
    li.textContent = animal;
    list.appendChild(li);
  });
}

function addCutting() {
  const cutting = document.getElementById("newCutting").value.trim();
  if (cutting && !cuttings.includes(cutting)) {
    cuttings.push(cutting);
    fillSelect("priceCutting", cuttings);
    fillSelect("cuttingType", cuttings);
    refreshCuttingsList();
    document.getElementById("newCutting").value = "";
  }
}

function refreshCuttingsList() {
  const list = document.getElementById("cuttingsList");
  list.innerHTML = "";
  cuttings.forEach(cutting => {
    const li = document.createElement("li");
    li.textContent = cutting;
    list.appendChild(li);
  });
}

function setPrice() {
  const animal = document.getElementById("priceAnimal").value;
  const cutting = document.getElementById("priceCutting").value;
  const price = parseFloat(document.getElementById("priceValue").value);
  if (animal && cutting && !isNaN(price)) {
    prices[`${animal}_${cutting}`] = price;
    alert("تم تعيين السعر بنجاح!");
  }
}

function addUser() {
  if (currentUser?.role !== "admin") return alert("غير مصرح!");
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const role = document.getElementById("newUserRole").value;
  const site = document.getElementById("newUserSite").value;
  if (id && name && role && site) {
    users.push({ id, name, role, site });
    refreshUsersTable();
    document.getElementById("addUserForm").reset();
  }
}

function refreshUsersTable() {
  const tbody = document.getElementById("usersTable").querySelector("tbody");
  tbody.innerHTML = "";
  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td>${u.site}</td><td></td>`;
    tbody.appendChild(row);
  });
}

function updatePrice() {
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const qty = parseInt(document.getElementById("quantity").value) || 0;
  const unitPrice = prices[`${animal}_${cutting}`] || 0;
  document.getElementById("unitPrice").value = unitPrice;
  document.getElementById("totalPrice").value = qty * unitPrice;
}

function saveData() {
  const phone = document.getElementById("phone").value;
  const clientName = document.getElementById("clientName").value;
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const qty = parseInt(document.getElementById("quantity").value) || 0;
  const unitPrice = parseFloat(document.getElementById("unitPrice").value) || 0;
  const total = parseFloat(document.getElementById("totalPrice").value) || 0;
  const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
  const site = currentUser?.site || "غير محدد";

  invoices.push({
    site, phone, clientName, animal, cutting, qty, unitPrice, total, paymentType,
    invoiceNumber: invoiceCounter,
    date: new Date().toLocaleString("ar-EG")
  });

  invoiceCounter++;
  updateInvoiceNumber();
  refreshReport();
  alert("تم حفظ البيانات!");
}

function refreshReport() {
  const tbody = document.getElementById("reportTable").querySelector("tbody");
  tbody.innerHTML = "";
  invoices.forEach(inv => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${inv.site}</td>
      <td>${inv.clientName}</td>
      <td>${inv.phone}</td>
      <td>${inv.invoiceNumber}</td>
      <td>${inv.animal}</td>
      <td>${inv.cutting}</td>
      <td>${inv.qty}</td>
      <td>${inv.paymentType}</td>
      <td>${inv.unitPrice}</td>
      <td>${inv.total}</td>
      <td>${inv.date}</td>
    `;
    tbody.appendChild(row);
  });
}

function showInvoice() {
  const phone = document.getElementById("phone").value;
  const clientName = document.getElementById("clientName").value;
  const animal = document.getElementById("animalType").value;
  const cutting = document.getElementById("cuttingType").value;
  const qty = parseInt(document.getElementById("quantity").value) || 0;
  const unitPrice = parseFloat(document.getElementById("unitPrice").value) || 0;
  const total = parseFloat(document.getElementById("totalPrice").value) || 0;
  const paymentType = document.querySelector('input[name="paymentType"]:checked').value;

  document.getElementById("invNo").textContent = invoiceCounter.toString().padStart(5, "0");
  document.getElementById("invClient").textContent = clientName;
  document.getElementById("invPhone").textContent = phone;
  document.getElementById("invAnimalType").textContent = animal;
  document.getElementById("invCuttingType").textContent = cutting;
  document.getElementById("invQty").textContent = qty;
  document.getElementById("invUnitPrice").textContent = unitPrice;
  document.getElementById("invTotal").textContent = total;
  document.getElementById("invPaymentType").textContent = paymentType;
  document.getElementById("invDate").textContent = new Date().toLocaleString("ar-EG");

  showSection("invoicePreview");
}

function uploadLogo(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = evt => {
      localStorage.setItem("logoData", evt.target.result);
      document.getElementById("logoSplash").src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function closeProgram() {
  window.close();
}
