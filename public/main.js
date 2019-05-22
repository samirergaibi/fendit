const views= {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"],
  user: ["#user-template"]
}

const api = {
  ping: function(){
    fetch("/api/ping")
    .then(resp => {
      if(!resp.ok){
        console.log(resp);
        throw new Error("Du är inte inloggad");
      }else{
        return resp.json();
      }
    })
    .then(data => {
      console.log(data);
      return data;
    })
  }
}


const viewFetches = {
  home: function(){
    fetch("/api/entries")
    .then(resp => resp.json())
    .then(data => {
        const entryContainer = document.getElementById("entry-container");
        data.forEach(entry => {
            entryContainer.innerHTML += 
            `<div class="entry">
                <h3>${entry.title}</h3>
                <p>${entry.createdBy}</p>
                <p>${entry.createdAt}</p>
                <button data-entryID='${entry.entryID}'>Edit</button>
            </div>`;
        })
    });
  },
  register(){
    console.log("register fetch");
  },
  login(){
    console.log("login fetch");
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

// Do this first when entering site
const loggedInNav = document.getElementById("logged-in-nav");
const loggedOutNav = document.getElementById("logged-out-nav");
loggedInNav.style.display = "none";
renderView(views.home);
viewFetches.home();

const menuItems = document.querySelectorAll("nav a");
menuItems.forEach(menuItem => {
  menuItem.addEventListener("click", function(e){
    e.preventDefault();

    let viewName = e.target.dataset.template;
    renderView(views[viewName]);
    if(viewFetches[viewName]){
      viewFetches[viewName]();
    }

    // We have to do this here, can't access the form outside (when rendering view it creates a new instance of the content)
    if(viewName === "register"){
      const registerForm = document.getElementById("register-form");
      registerForm.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const registerMsg = document.getElementById("register-msg");
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
      })
    }
    else if(viewName === "login"){
      const loginForm = document.getElementById("login-form");
      loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const formData = new FormData(loginForm);
        // formData.set("entryID", e.target.dataset["entryID"]);
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
          renderView(views.user);
          loggedInNav.style.display = "block";
          loggedOutNav.style.display = "none";
        })
      });
    }


  });
});