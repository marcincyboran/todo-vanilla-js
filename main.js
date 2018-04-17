document.addEventListener('DOMContentLoaded', () => {

    const app = document.querySelector('#app');
    const submit = document.querySelector('#submitButton');
    const name = document.querySelector('#nameInput');
    const desc = document.querySelector('#descriptionInput');
    const info = document.querySelector('#itemsLeft');
    const list = document.querySelector('#list');
    const descriptionDiv = document.querySelector('#description');
    const pItems = document.querySelector('#itemsLeft');
    const all = document.querySelector('a[href="#All"]');
    const active = document.querySelector('a[href="#Active"]');
    const completed = document.querySelector('a[href="#Completed"]');
    const clear = document.querySelector('a[href="#clearDone"]');

    // Modal
    const modal = document.querySelector('#myModal');
    const modalOff = document.querySelector("#close_modal");
    const form = modal.querySelector("#editForm");

    let notes = [];

    const nameRegExp = /^[a-z0-9\s]{1,20}$/i;
    const descRegExp = /^[a-z0-9\s\.\,\;\:\!\-\+\=\$\%\@\#\(\)]{1,200}$/i;


    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        if ((nameRegExp.test(ev.target.editName.value)) &&
            (descRegExp.test(ev.target.editDescription.value))) {

            const item = list.querySelector("[data-id=" + ev.target.dataset.id + "]");
            const content = item.querySelector(".content");
            content.innerHTML = "<p>" + ev.target.editName.value + "</p><p>" +
                ev.target.editDescription.value + "</p>";
            notes = notes.map((el) => {
                if (el._id == ev.target.dataset.id) {
                    el.name = ev.target.editName.value;
                    el.description = ev.target.editDescription.value;
                    el.updated = new Date();
                    saveData()
                }
                return el;
            });
            ev.target.querySelector("#nameWarn").style.display = "none";
            ev.target.querySelector("#descWarn").style.display = "none";
            modal.style.display = "none";

        } else {

            if (nameRegExp.test(ev.target.editName.value)) {
                ev.target.querySelector("#nameWarn").style.display = "none";
            } else {
                ev.target.querySelector("#nameWarn").style.display = "block";
            }

            if (descRegExp.test(ev.target.editDescription.value)) {
                ev.target.querySelector("#descWarn").style.display = "none";
            } else {
                ev.target.querySelector("#descWarn").style.display = "block";
            }
        }

    });

    modalOff.addEventListener('click', (ev) => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (ev) => {
        if (ev.target == modal) {
            modal.style.display = "none";
        }
    });

    submit.addEventListener('click', (ev) => {

        if ((nameRegExp.test(name.value)) &&
            (descRegExp.test(desc.value))) {
            createNote();
            name.value = '';
            desc.value = '';
            descriptionDiv.classList.add('off');
            name.style.backgroundColor = null;
            desc.style.backgroundColor = null;
        } 
        // else {

        //     if (nameRegExp.test(name.value)) {
        //         name.style.backgroundColor = null;
        //     } else {
        //         name.style.backgroundColor = "lightcoral";
        //     }

        //     if (nameRegExp.test(desc.value)) {
        //         desc.style.backgroundColor = null;
        //     } else {
        //         desc.style.backgroundColor = "lightcoral";
        //     }
        // }
    });

    document.addEventListener('click', (ev) => {
        descriptionDiv.classList.add('off');
    });

    app.addEventListener('click', (ev) => {
        ev.stopPropagation();
    });

    name.addEventListener('focus', (ev) => {
        descriptionDiv.classList.remove('off');
    });

    clear.addEventListener('click', (ev) => {
        clearDone(ev)
    });

    all.addEventListener('click', (ev) => {
        show(ev);
    });

    active.addEventListener('click', (ev) => {
        show(ev, "active");
    });

    completed.addEventListener('click', (ev) => {
        show(ev, "done");

    });

    init = () => {

        if (localStorage.getItem('notes') == null) {
            console.info('LocalStorage is empty, add note first');
        } else {
            notes = JSON.parse(localStorage.getItem('notes'));
            saveData();

            for (let i = 0; i < notes.length; i++) {
                addNotes(notes[i]);
            };
        }

        activeCounter();
        name.value = '';
        desc.value = '';
    };

    saveData = () => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    generateId = () => {
        // Work well with less then 10k id's
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    createNote = () => {
        const note = {
            _id: generateId(),
            name: name.value,
            description: desc.value,
            date: new Date(),
            active: true
        };
        notes.push(note);
        saveData();
        addNotes(note);
        activeCounter();
    };

    addNotes = (item) => {

        const divItem = document.createElement('div');
        divItem.classList.add('item');
        item.active ? divItem.classList.add('item_active') : divItem.classList.add('item_done');

        divItem.dataset.id = item._id;

        // rowLeft
        const divRowLeft = document.createElement('div');
        divRowLeft.classList.add('rowLeft');

        const label = document.createElement('label');
        label.classList.add('label');

        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.checked = !item.active;
        input.addEventListener('change', (ev) => {
            toggleStatus(ev, divItem);
        })

        const span = document.createElement('span');
        span.classList.add('checkmark');

        label.appendChild(input);
        label.appendChild(span);
        divRowLeft.appendChild(label);

        // rowRight
        const divRowRight = document.createElement('div');
        divRowRight.classList.add('rowRight');

        const content = document.createElement('div');
        content.classList.add('content');

        const text = document.createElement('p');
        const text2 = document.createElement('p');
        text.textContent = item.name;
        text2.textContent = item.description;

        content.appendChild(text);
        content.appendChild(text2);

        const time = document.createElement('div');
        time.classList.add("time");
        const timeP = document.createElement('p');
        const date = new Date(item.date);
        timeP.innerHTML = date.toLocaleString();
        time.appendChild(timeP);

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        let temp = document.createDocumentFragment();
        let i = 0;
        while (i < 2) {
            let whatIcon;
            switch (i) {
                case 0:
                    whatIcon = 'edit';
                    break;
                case 1:
                    whatIcon = 'delete';
                    break;
            };
            const a = document.createElement('a');
            a.href = '#' + whatIcon;

            const icon = document.createElement('i');
            icon.classList.add('material-icons');
            icon.innerHTML = whatIcon;

            if (whatIcon === "delete") {
                icon.addEventListener('click', (ev) => {
                    deleteNote(ev, divItem, item._id);
                });
            };
            if (whatIcon === "edit") {
                icon.addEventListener('click', (ev) => {
                    handleModal(ev, item);
                    modal.style.display = "block";
                });
            };
            if (whatIcon === "info") {
                icon.addEventListener('click', (ev) => {
                    console.log('info');
                });
            };

            a.appendChild(icon);
            temp.appendChild(a);
            i++;
        };

        buttons.appendChild(temp);
        divRowRight.appendChild(content);
        divRowRight.appendChild(time);
        divRowRight.appendChild(buttons);

        // All together
        divItem.appendChild(divRowLeft);
        divItem.appendChild(divRowRight);

        // Add to list
        list.prepend(divItem);
        console.log("created")
    };

    deleteNote = (ev, delItem, id) => {
        if (id) {
            notes = notes.filter((el) => {
                return el._id !== id;
            });
            saveData();
        }
        list.removeChild(delItem);
    };

    toggleStatus = (ev, item) => {
        // const item = ev.target.parentNode.parentNode.parentNode;
        const id = item.dataset.id;
        item.classList.toggle("item_done");
        item.classList.toggle("item_active");
        notes = notes.map((el) => {
            if (el._id === id) {
                el.active = !el.active;
            }
            return el;
        });
        saveData();
        activeCounter();
    };

    show = (ev, what) => {

        const items = Array.from(list.children);
        items.forEach((item) => {
            item.classList.remove("hidden")
        });
        if (what) {
            console.log(what);
            items.forEach((item) => {
                if (!item.classList.contains("item_" + what)) {
                    item.classList.add("hidden");
                }
            });
        }
    }

    clearDone = (ev) => {

        //Find done and remove
        const items = Array.from(list.children);
        items.forEach((item) => {
            if (item.classList.contains("item_done")) {
                deleteNote(ev, item)
            }
        });

        // filter and save origin
        notes = notes.filter((el) => {
            return el.active;
        });


        saveData();
    }

    activeCounter = () => {
        pItems.innerHTML = "Tasks left: " + list.querySelectorAll(".item_active").length;
    }

    handleModal = (ev, item) => {
        form.dataset.id = item._id;
        form.editName.value = item.name;
        form.editDescription.value = item.description;
    }

    init();
});