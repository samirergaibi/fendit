const views= {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"]
}

const viewFetches = {
  home: function(){
    fetch("/entries")
    .then(resp => resp.json())
    .then(data => {
        const entryContainer = document.getElementById("entry-container");
        data.forEach(entry => {
            entryContainer.innerHTML += 
            `<div class="entry">
                <h3>${entry.title}</h3>
                <p>${entry.createdBy}</p>
                <p>${entry.createdAt}</p>
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
        fetch("/register", {
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


  });
});