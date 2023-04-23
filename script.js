const block = document.querySelector(".wrapper");
const actions = document.querySelectorAll("[data-action]");
const addBtn = document.querySelector(".add");
const mdBox = document.querySelector(".modal-block");
const mdBox2 = document.querySelector(".modal-block2");
const mdClose = mdBox.querySelector(".modal-close");
const mdClose2 = mdBox2.querySelector(".modal-close");
const cardUpdate = document.querySelectorAll(".card_update");
let modals = document.querySelectorAll(".modal");
let author = "madamMary";
const addForm = document.forms.add;
const updForm = document.forms.upd;
let name = "madamMary";
let path = `https://cats.petiteweb.dev/api/single/${name}`;

let cats = localStorage.getItem("mimi-cats");
cats = cats ? JSON.parse(cats) : [];
actions.forEach(btn => {
    btn.addEventListener("click", () => {
        Array.from(modals).find(m => m.dataset.type === btn.dataset.action).classList.add("active");
    })
})

fetch(path + "/show")
    .then(function (res) {
        console.log(res);
        return res.json();
    })
    .then(function (data) {
        console.log(data);
        if (data.length) {
            pets = data;
            localStorage.setItem("mimi-cats", JSON.stringify(data));
            for (let pet of data) {
                createCard(pet, block);
            }
        }
    })

addBtn.addEventListener("click", e => {
    mdBox.classList.toggle("active");
});
mdClose.addEventListener("click", e => {
    mdBox.classList.remove("active");
});
mdBox.addEventListener("click", e => {
    if (e.target === e.currentTarget) {
        mdBox.classList.remove("active");
    }
});

addForm.addEventListener("submit", e => {
    e.stopPropagation();
    e.preventDefault();

    const body = {}
    for (let i = 0; i < addForm.elements.length; i++) {
        const el = addForm.elements[i];
        console.log(el.name, el.value);
        if (el.name) {
            body[el.name] = el.value;
            if (el.name === "favorite") {
                body[el.name] = el.checked;
            } else {
                body[el.name] = el.value;
            }
        }
    }
    fetch(path + "/add", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => {
            if (res.status === 200) {
                addForm.reset();
                mdBox.classList.remove("active");
                createCard(body, block);
                pets.push(body);
                localStorage.setItem("mimi-cats", JSON.stringify(pets));
            }
        })
        .catch(message => alert(message));

})

function createCard(pet, tag) {
    const card = document.createElement("div");
    card.className = "card";
    const cardImg = document.createElement("div");
    cardImg.className = "pic";
    if (pet.image) {
        cardImg.style.backgroundImage = `url(${pet.image})`;
    } else {
        cardImg.classList.add("tmp");
    }
    const cardTitle = document.createElement("h2");
    cardTitle.innerText = pet.name;

    const cardLike = document.createElement("i");
    cardLike.className = "like fa-heart";
    cardLike.classList.add(pet.favorite ? "fa-solid" : "fa-regular");
    cardLike.addEventListener("click", e => {
        setLike(cardLike, pet.id, !pet.favorite);
    })

    const trash = document.createElement("i");
    trash.className = "fa-solid fa-trash card_trash";
    trash.addEventListener("click", e => {
        deleteCard(pet.id, card);
    })

    const update = document.createElement("i");
    update.className = "fa-solid fa-pen card_update";
    update.addEventListener("click", e => {
        updateForm(pet.id, card);
    })

    card.append(cardImg, cardTitle, cardLike, trash, update);
    tag.append(card);
    cardImg.style.height = cardImg.offsetWidth + "px";
}

function setLike(el, id, like) {
    el.classList.toggle("fa-solid");
    el.classList.toggle("fa-regular");

    fetch(path + "/update/" + id, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ favorite: like })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            pets = pets.map(p => {
                if (p.id === id) {
                    p.favorite = like;
                }
                return p;
            })
            localStorage.setItem("mimi-cats", JSON.stringify(pets));
        })
}

function deleteCard(id, el) {
    if (id) {
        fetch(`${path}/delete/${id}`, {
            method: "delete"
        })
            .then(res => {
                console.log(res);
                console.log(res.status);
                if (res.status === 200) {
                    el.remove();
                }
            })
    }
}

function updateForm(id, el) {
    mdBox2.classList.toggle("active");

    fetch(path + "/show" + `/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(updForm.elements.name.value)
            updForm.elements.name.value = data.name;
            updForm.elements.age.value = data.age;
            updForm.elements.image.value = data.image;
            updForm.elements.image.discription = data.discription;
            updForm.elements.favorite.checked = data.favorite;
            updForm.elements.id.value = data.id;
        })

}

mdClose2.addEventListener("click", e => {
    mdBox2.classList.remove("active");
});
mdBox2.addEventListener("click", e => {
    if (e.target === e.currentTarget) {
        mdBox2.classList.remove("active");
    }
});

updForm.addEventListener("submit", e => {
    e.stopPropagation();
    e.preventDefault();

    const body = {}
    for (let i = 0; i < updForm.elements.length; i++) {
        const el = updForm.elements[i];
        console.log(el.name, el.value);
        if (el.name) {
            body[el.name] = el.value;
            if (el.name === "favorite") {
                body[el.name] = el.checked;
            } else {
                body[el.name] = el.value;
            }
        }
    }
    fetch(path + `/update/${body.id}`, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => {
            if (res.status === 200) {
                updForm.reset();
                mdBox2.classList.remove("active");
                createCard(body, block);
                pets.push(body);
                localStorage.setItem("mimi-cats", JSON.stringify(pets));
            }
        })
        .catch(message => alert(message));

})

