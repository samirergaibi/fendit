const views= {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"]
}

const fetchViews = {
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
fetchViews.home();

const menuItems = document.querySelectorAll("nav a");

menuItems.forEach(menuItem => {
  menuItem.addEventListener("click", function(e){
    e.preventDefault();

    let viewName = e.target.dataset.template;
    renderView(views[viewName]);
    if(fetchViews[viewName]){
      fetchViews[viewName]();
    }

    // We have to do this here, can't access the form outside (when rendering view it creates a new instance of the content)
    if(viewName === "register"){
      const registerForm = document.getElementById("register-form");
      registerForm.addEventListener("submit", e => {
        e. preventDefault();

        const formData = new FormData(registerForm);
        fetch("/register", {
          method: "POST",
          body: formData
        }).then(resp => {
          if(!resp.ok){
            throw new Error(resp.statusText);
          }
          else{
            // Confirm the registration here
            console.log("Account created.");
          }
        }).catch(err => console.log(err));
      })
    }


  });
});