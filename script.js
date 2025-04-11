const form = document.getElementById("goalForm");
const goalList = document.getElementById("goalList");
const message = document.getElementById("message");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const content = document.getElementById("goalContent").value.trim();
  const priority = document.getElementById("priority").value;

  if (!content || !priority) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const newGoal = {
    id: Date.now(),
    content,
    priority,
    status: "Chưa đạt"
  };

  goals.push(newGoal);
  saveGoals();
  showMessage("Thêm mục tiêu thành công!");
  form.reset();
  renderGoals();
});

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function renderGoals(filter = "all") {
  goalList.innerHTML = "";

  const filtered = goals.filter(goal => {
    if (filter === "done") return goal.status === "Đã đạt";
    if (filter === "not_done") return goal.status === "Chưa đạt";
    return true;
  });

  filtered.forEach(goal => {
    const tr = document.createElement("tr");
    if (goal.status === "Đã đạt") tr.classList.add("completed");

    tr.innerHTML = `
      <td>${goal.content}</td>
      <td>${goal.priority}</td>
      <td>${goal.status}</td>
      <td class="actions">
        <button onclick="editGoal(${goal.id})">Sửa</button>
        <button onclick="deleteGoal(${goal.id})">Xoá</button>
        <button onclick="toggleStatus(${goal.id})">Đổi trạng thái</button>
      </td>
    `;

    goalList.appendChild(tr);
  });
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => message.textContent = "", 2000);
}

function deleteGoal(id) {
  if (confirm("Bạn có chắc chắn muốn xoá mục tiêu này?")) {
    goals = goals.filter(goal => goal.id !== id);
    saveGoals();
    showMessage("Xoá thành công!");
    renderGoals();
  }
}

function toggleStatus(id) {
  goals = goals.map(goal =>
    goal.id === id ? { ...goal, status: goal.status === "Đã đạt" ? "Chưa đạt" : "Đã đạt" } : goal
  );
  saveGoals();
  renderGoals();
}

function editGoal(id) {
  const goal = goals.find(g => g.id === id);
  const newContent = prompt("Nhập nội dung mới:", goal.content);
  const newPriority = prompt("Nhập mức độ quan trọng mới:", goal.priority);

  if (newContent && newPriority) {
    goal.content = newContent.trim();
    goal.priority = newPriority.trim();
    saveGoals();
    showMessage("Sửa thành công!");
    renderGoals();
  }
}

function filterGoals(type) {
  renderGoals(type);
}

// Hiển thị dữ liệu khi trang vừa tải
renderGoals();
