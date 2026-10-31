// ==========================================
// ۱. گرفتن المان‌های HTML
// ==========================================
let taskInput = document.getElementById("taskInput")
let addBtn = document.getElementById("addBtn")
let taskList = document.getElementById("taskList")
let counter = document.getElementById("counter")
let delAll = document.getElementById("delall")

// ==========================================
// ۲. State (وضعیت برنامه) — آرایه‌ی تسک‌ها
// ==========================================
let saved = localStorage.getItem("tasks")
let tasks = saved ? JSON.parse(saved) : []

// ==========================================
// ۳. توابع منطقی (روی آرایه کار می‌کنن)
// ==========================================

// اضافه کردن تسک جدید به آرایه
function addTask(title) {
    let newTask = {
        id: Date.now(),        // ← id یکتا
        title: title,
        done: false
    }
    tasks = [...tasks, newTask]     // ← آرایه‌ی جدید
}

// برعکس کردن وضعیت یه تسک
function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            return { ...t, done: !t.done }
        }
        return t
    })
}

// حذف یه تسک
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id)
}
// ویرایش عنوان یه تسک
function editTask(id, newTitle) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            return { ...t, title: newTitle }
        }
        return t
    })
}

// شمارش تسک‌های انجام‌شده
function countDone() {
    return tasks.reduce((acc, t) => {
        return t.done ? acc + 1 : acc
    }, 0)
}

// حذف همه‌ی تسک‌ها
function deleteAllTasks() {
    tasks = []
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// ==========================================
// ۴. تابع رندر — نمایش آرایه روی صفحه
// ==========================================
function render() {
    // لیست قبلی رو پاک کن
    taskList.innerHTML = ""

    // برای هر تسک، یه <li> بساز
    tasks.forEach(t => {
        let li = document.createElement("li")
        if (t.done) {
            li.classList.add("done")
        }

        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = t.done
        checkbox.addEventListener("change", () => {
            toggleTask(t.id)
            render()
        })

        let span = document.createElement("span")
        span.textContent = t.title



        let delBtn = document.createElement("button")
        delBtn.textContent = "✕"
        delBtn.addEventListener("click", () => {
            deleteTask(t.id)
            render()
        })

        let editBtn = document.createElement("button")
        editBtn.textContent = "✎"
        editBtn.addEventListener("click", () => {
        let input = document.createElement("input")
        input.type = "text"
        input.value = t.title
        input.className = "edit-input"

        // جایگزین span با input
        li.replaceChild(input, span)
        input.focus()

        function save() {
            let newTitle = input.value.trim()
            if (newTitle !== "") {
                editTask(t.id, newTitle)
            }
            render()
        }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save()
        if (e.key === "Escape") render()   // ← لغو
    })
    input.addEventListener("blur", save)   // ← کلیک بیرون = ذخیره
})

        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(editBtn)
        li.appendChild(delBtn)
        taskList.appendChild(li)
    })

    // آپدیت شمارنده
    counter.textContent = `${countDone()} / ${tasks.length}`
    saveTasks()    // ← این خط رو اضافه کن

}


// ==========================================
// ۵. وصل کردن دکمه‌ها و input
// ==========================================
addBtn.addEventListener("click", () => {
    let title = taskInput.value.trim()      // ← trim فاصله‌های اضافی رو حذف می‌کنه
    if (title === "") return                // ← اگه خالی بود، هیچی
    addTask(title)
    taskInput.value = ""                    // ← input رو خالی کن
    render()
})

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let title = taskInput.value.trim()
        if (title === "") return
        addTask(title)
        taskInput.value = ""
        render()
    }
})

delAll.addEventListener("click", () => {
    if (tasks.length === 0) return          // ← اگه لیست خالیه، هیچی
    if (confirm("همه‌ی تسک‌ها حذف بشن؟")) {
        deleteAllTasks()
        render()
    }
})


// ==========================================
// ۶. رندر اولیه (وقتی صفحه باز میشه)
// ==========================================
render()