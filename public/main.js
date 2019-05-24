const views = {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"],
  logout: ["#home-template"],
  entry: ['#full-entry-template'],
  userEntries: ["#user-entries-template"]
}

const viewFetches = {
  home: function (loggedIn = false) {
    fetch("/api/entries")
      .then(resp => resp.json())
      .then(data => {
        const entryContainer = document.getElementById("entry-container");
        const loggedInNav = document.getElementById("logged-in-nav");
        const loggedOutNav = document.getElementById("logged-out-nav");
        data.forEach(entry => {
          if (loggedIn) {
            btn = `<button  data-entryID='${entry.entryID}'>Comment</button>`;
            loggedInNav.style.display = "block";
            loggedOutNav.style.display = "none";
          } else {
            btn = "";
            loggedOutNav.style.display = "block";
            loggedInNav.style.display = "none";
          }
          entryContainer.innerHTML +=`
          <div class="entry">
            <h3>${entry.title}</h3>
            <p>${entry.username}</p>
            <p>${entry.createdAt}</p>
            <button class="see-full-entry" data-entryID='${entry.entryID}'>See Full Entry</button>
            ${btn}
          </div>`;
        })
        userEventListeners.goToFullEntry();
    })
      .catch(err => console.log(err));
  },
  register: function (formData, registerMsg) {
    fetch("/api/register", {
      method: "POST",
      body: formData
    }).then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        registerMsg.innerText = "Account has been succefully created.";
        registerMsg.style.color = "#4BB543";
        registerMsg.classList.remove("hidden");
      }
    }).catch(err => {
      registerMsg.innerText = "Username is already in use, please choose another one.";
      registerMsg.style.color = "#e74c3c";
      registerMsg.classList.remove("hidden");
    });
  },
  login: function (formData) {
    fetch("/api/login", {
      method: "POST",
      body: formData
    }).then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        return resp.json();
      }
    }).then(data => {
      console.log(data);
      if (data.loggedIn) {
        renderView(views.home);
        viewFetches.home(data.loggedIn);
      } else {
        renderView(views.login);
        const errorMsg = document.getElementById("error-msg");
        errorMsg.innerText = data.message;
      }
    })
      .catch(err => console.log(err));
  },
  entry: function (loggedIn = false, entryID) {
    fetch(`/api/fullentry/${entryID}`)
      .then(resp => resp.json())
      .then(data => {
        let btn;
        if (loggedIn) {
          btn = `<button data-entryID="${data.entryID}">Comment</button>`
        } else {
          btn = "";
        }
        renderView(views.entry);
        entryContainer = document.getElementById('entry-container');
        entryContainer.innerHTML = `
        <h1>${data.title}</h1>
        <p>${data.content}<p>
        <p>${data.createdBy}<p>
        <p>${data.createdAt}<p>
        ${btn}`;
      })
      .catch(err => console.log(err));
  },
  userEntries: function(){
    fetch(`/api/userentries`)
      .then(resp => resp.json())
      .then(data => {
        const createEntryContainer = document.getElementById("create-entry-container");
        createEntryContainer.innerHTML += `
        <form id="create-entry-form">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" autocomplete="off">
          <label for="content">Content</label>
          <textarea name="content" id="content" cols="60" rows="10"></textarea>
          <input type="submit" value="Create">
        </form>`;
        data.forEach(entry => {
          const userEntriesContainer = document.getElementById("user-entries-container");
          userEntriesContainer.innerHTML += `
          <div class="entry">
            <h1>${entry.title}</h1>
            <p>${entry.content}</p>
            <p>${entry.username}</p>
            <p>${entry.createdAt}</p>
            <button data-entryID="${entry.entryID}" id="edit-entry-btn">Edit</button>
            <button data-entryID="${entry.entryID}" id="delete-entry-btn">Remove</button>
          </div>`;
        })
        userEventListeners.createEntry();
      })
      .catch(err => console.log(err));
  }
  ,
  // SAMIR JOBBAR ÖVER DENNA KOMMENTAR
  // TOBBE JOBBA UNDER DENNA KOMMENTAR
  
}

const userEventListeners = {
  goToFullEntry: function(){
    const fullEntry = document.querySelectorAll(".entry .see-full-entry");
    fullEntry.forEach(entry => {
      entry.addEventListener('click', function (e) {
        const entryID = e.target.dataset.entryid;
        showCorrectView('entry', entryID)
      })
    })
  },
  createEntry: function(){
    const createEntryForm = document.getElementById("create-entry-form");
    createEntryForm.addEventListener("submit", e => {
      e.preventDefault();
      const formData = new FormData(createEntryForm);
      fetch("/api/entry", {
        method: "POST",
        body: formData
      })
        .then(resp => {
          if(!resp.ok){
            throw new Error(resp.statusText);
          }else{
            return resp.json();
          }
        })
        .then(data => {
          renderView(views.userEntries);
          viewFetches.userEntries();
          // Meddelandet skrivs inte ut, troligtvis pga. att det renderas innan ovanstående funktionsanrop
          const createEntryMsg = document.getElementById("create-entry-msg");
          createEntryMsg.innerHTML += `<p>${data.message}</p>`;
        })
        .catch(err => console.log(err));
    })
  },
  editEntry: function(){
    const editEntryBtn = document.getElementById("edit-entry-btn");
    // editEntryBtn.
  }
  ,
  // SAMIR JOBBAR ÖVER DENNA KOMMENTAR
  // TOBBE JOBBA UNDER DENNA KOMMENTAR

}

function renderView(view) {
  const target = document.querySelector("main");
  target.innerHTML = "";
  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;
    const div = document.createElement("div");
    div.innerHTML = templateMarkup;
    target.append(div);
  });
}

// When entering site we ping to check if the user is logged in or not and show appropriate view
function showCorrectView(view, entryID) {
  fetch("/api/ping")
    .then(resp => {
      if (!resp.ok) {
        throw new Error("Not doing much, just throwing an error.");
      } else {
        return resp.json();
      }
    })
    .then(data => {
      if (data.loggedIn === true) {
        console.log("You are logged in!");
        renderView(views[view]);
        viewFetches[view](true, entryID);
      } else {
        console.log("You are not supposed to end up here.. You are not logged in however");
      }
    })
    .catch(err => {
      console.log("You are not logged in");
      renderView(views[view]);
      viewFetches[view](false, entryID);
    });
}
showCorrectView("home");

const menuItems = document.querySelectorAll("nav a");
menuItems.forEach(menuItem => {
  menuItem.addEventListener("click", function (e) {
    e.preventDefault();

    const viewName = e.target.dataset.template;
    renderView(views[viewName]);

    if (viewName === "home") {
      showCorrectView("home");
    } else if (viewName === "register") {
      const registerForm = document.getElementById("register-form");
      registerForm.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const registerMsg = document.getElementById("register-msg");
        viewFetches.register(formData, registerMsg);
      })
    } else if (viewName === "login") {
      const loginForm = document.getElementById("login-form");
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(loginForm);
        viewFetches.login(formData);
      });
    } else if (viewName === "logout") {
      console.log("LOGOUT");
      fetch("/api/logout");
      viewFetches.home();
    } else if (viewName === "userEntries"){
      viewFetches.userEntries();
    }
  });
});