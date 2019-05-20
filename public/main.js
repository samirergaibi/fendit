const views= {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"]
}

const fetchViews = {
  home: function(){
    fetch("/get-latest-entries")
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

const target = document.querySelector("main");
function renderView(view){
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

menuItems.forEach(view => {
  view.addEventListener("click", function(e){
    e.preventDefault();

    let viewName = e.target.dataset.template;
    renderView(views[viewName]);
    fetchViews[viewName]();
  });
});