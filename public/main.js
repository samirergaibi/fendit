const views = {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"],
  logout: ["#home-template"],
}

const viewFetches = {
  home: function(loggedIn = false){
    fetch("/api/entries")
    .then(resp => resp.json())
    .then(data => {
        const entryContainer = document.getElementById("entry-container");
        const loggedInNav = document.getElementById("logged-in-nav");
        const loggedOutNav = document.getElementById("logged-out-nav");
        data.forEach(entry => {
          if(loggedIn){
            btn = `<button data-entryID='${entry.entryID}'>Comment</button>`;
            loggedInNav.style.display = "block";
            loggedOutNav.style.display = "none";
          }else{
            btn = "";
            loggedOutNav.style.display = "block";
            loggedInNav.style.display = "none";
          }
            entryContainer.innerHTML += 
            `<div class="entry">
                <h3>${entry.title}</h3>
                <p>${entry.createdBy}</p>
                <p>${entry.createdAt}</p>
                <button data-entryID='${entry.entryID}'>See Full Entry</button>
                ${btn}
            </div>`;
        })
    });
  },
  register: function(formData, registerMsg){
    fetch("/api/register", {
      method: "POST",
      body: formData
    }).then(resp => {
      if(!resp.ok){
        throw new Error(resp.statusText);
      }
      else{
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
  login: function(formData){
    fetch("/api/login", {
      method: "POST",
      body: formData
    }).then(resp => {
      if(!resp.ok){
        throw new Error(resp.statusText);
      }else{
        return resp.json();
      }
    }).then(data => {
      console.log(data);
      if(data.loggedIn){
        renderView(views.home);
        viewFetches.home(data.loggedIn);
      }else{
        renderView(views.login);
        const errorMsg = document.getElementById("error-msg");
        errorMsg.innerText = data.message;
      }
    })
  }
}

function renderView(view){
  const target = document.querySelector("main");
  target.innerHTML = "";

  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;
    const div = document.createElement("div");

    div.innerHTML = templateMarkup;
    target.append(div);
  });
}

// When entering site we ping to check if the user is logged in or not
function checkIfLoggedIn(){
  fetch("/api/ping")
    .then(resp => {
      if(!resp.ok){
        throw new Error("Not doing much, just throwing an error.");
      }else{
        return resp.json();
      }
    })
    .then(data => {
      if(data.loggedIn === true){
        console.log("You are logged in!");
        renderView(views.home);
        viewFetches.home(true);
      }else{
        console.log("You are not supposed to end up here.. You are not logged in however");
      }
    })
    .catch(err => {
      console.log("You are not logged in");
      renderView(views.home);
      viewFetches.home(false);
    });
}
checkIfLoggedIn();

const menuItems = document.querySelectorAll("nav a");
menuItems.forEach(menuItem => {
  menuItem.addEventListener("click", function(e){
    e.preventDefault();

    const viewName = e.target.dataset.template;
    renderView(views[viewName]);
    
    if(viewName === "home"){
      checkIfLoggedIn();
    }
    else if(viewName === "register"){
      const registerForm = document.getElementById("register-form");
      registerForm.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const registerMsg = document.getElementById("register-msg");
        viewFetches.register(formData, registerMsg);
      })
    }
    else if(viewName === "login"){
      const loginForm = document.getElementById("login-form");
      loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const formData = new FormData(loginForm);
        viewFetches.login(formData);
      });
    }
    else if(viewName === "logout"){
      console.log("LOGOUT");
      fetch("/api/logout");
      viewFetches.home();
    }
  });
});