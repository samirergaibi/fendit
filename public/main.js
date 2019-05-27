const views = {
  login: ["#login-template"],
  register: ["#register-template"],
  home: ["#home-template"],
  logout: ["#home-template"],
  entry: ['#full-entry-template'],
  userEntries: ["#user-entries-template"],
  users: ["#users-template"],
  search: ["#search-template"],
  trending: ["#trending-template"]
};

const viewFetches = {
  home: function (loggedIn = false) {
    fetch("/api/entries")
      .then(resp => resp.json())
      .then(data => {
        const entryContainer = document.getElementById("entry-container");
        const loggedInNav = document.getElementById("logged-in-nav");
        const loggedOutNav = document.getElementById("logged-out-nav");
        let btn;
        let amountLikes;
        data.forEach(entry => {
          if (loggedIn) {
            btn = `<button data-entryID='${entry.entryID}' class="like-btn">Like</button>`;
            loggedInNav.style.display = "flex";
            loggedOutNav.style.display = "none";
          } else {
            btn = `<button data-entryID='${entry.entryID}' disabled>Like</button>`;
            loggedOutNav.style.display = "flex";
            loggedInNav.style.display = "none";
          }
          if(entry.likes === null){
            entry.likes = 0;
          }
          amountLikes = `<span class="likes">${entry.likes}</span>`;
          entryContainer.innerHTML +=`
          <div class="entry" id="entry-${entry.entryID}">
            <h3>${entry.title}</h3>
            <p>Written by: <span class="highlight-author">${entry.username}</span></p>
            <p>Posted: ${entry.createdAt}</p>
            <button class="full-entry-btn" data-entryID='${entry.entryID}'>See Full Entry</button>
            ${btn}
            ${amountLikes}
          </div>`;
        })
        userEventListeners.loadMoreEntries(loggedIn);
        userEventListeners.goToFullEntry();
        userEventListeners.likeComment();
    })
      .catch(err => console.log(err));
  },
  trending: function(loggedIn = false){
    fetch('/api/trending')
      .then(resp=> resp.json())
      .then(data=>{
        const trendingContainer = document.getElementById('trending-container');
        const loggedInNav = document.getElementById("logged-in-nav");
        const loggedOutNav = document.getElementById("logged-out-nav");
        let btn;
        let amountLikes;
        data.forEach(entry => {
          if (loggedIn) {
            btn = `<button data-entryID='${entry.entryID}' class="like-btn">Like</button>`;
            loggedInNav.style.display = "flex";
            loggedOutNav.style.display = "none";
          } else {
            btn = `<button data-entryID='${entry.entryID}' disabled>Like</button>`;
            loggedOutNav.style.display = "flex";
            loggedInNav.style.display = "none";
          }
          if(entry.likes === null){
            entry.likes = 0;
          }
          amountLikes = `<span class="likes">${entry.likes}</span>`;
          trendingContainer.innerHTML +=`
          <div class="entry" id="entry-${entry.entryID}">
            <h3>${entry.title}</h3>
            <p>Written by: <span class="highlight-author">${entry.username}</span></p>
            <p>Posted: ${entry.createdAt}</p>
            <button class="full-entry-btn" data-entryID='${entry.entryID}'>See Full Entry</button>
            ${btn}
            ${amountLikes}
          </div>`;
        })

        userEventListeners.goToFullEntry();
        userEventListeners.likeComment();
      })
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
      if (data.loggedIn) {
        renderView(views.home);
        viewFetches.home(data.loggedIn);
      } else {
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
        let commentBox;
        if (loggedIn) {
          commentBox = `<textarea name="content" rows="4" cols="50"></textarea>`;
          btn = `<button class="create-comment" data-entryID="${data.entryID}">Comment</button>`;
        } else {
          btn = "";
          commentBox = "";
        }
        renderView(views.entry);
        entryContainer = document.getElementById('entry-container');
        entryContainer.innerHTML = `
        <h1>${data.title}</h1>
        <p>${data.content}<p>
        <p>${data.username}<p>
        <p>${data.createdAt}<p>
        <form id="comment-form">
        ${commentBox}<br>
        ${btn}
        </form>`;
      })
      .catch(err => console.log(err));

    fetch(`/api/comments/${entryID}`)
      .then(resp => {
        if(!resp.ok){
          throw new Error(resp.statusText);
        }else{
          return resp.json();
        }
      })
      .then(data => {
        commentContainer = document.getElementById('comment-container');
        let editBtn;
        let deleteBtn;
        const currentUser = data["currentUser"];
        data["data"].forEach(comment => {
          if (loggedIn && currentUser === comment.createdBy) {
            editBtn = `<button data-commentid="${comment.commentID}" class="edit-comment-btn">Edit</button>`;
            deleteBtn = `<button data-commentid="${comment.commentID}" class="delete-comment-btn">Delete</button>`;
          } else {
            editBtn = "";
            deleteBtn = "";
          }
          commentContainer.innerHTML += `
            <div class="comment" id="comment-${comment.commentID}">
            <p class="small-text">${comment.username}</p>
            <p class="small-text">${comment.createdAt}</p>
            <p id="comment-content-${comment.commentID}">${comment.content}</p>
            ${editBtn}
            ${deleteBtn}
            </div>`;
        })
        if (loggedIn) {
          userEventListeners.createComment();
          userEventListeners.editComment();
          userEventListeners.deleteComment();
        }
      })
      .catch(err => console.log(err));
  },
  userEntries: function(){
    fetch("/api/user-entries")
      .then(resp => resp.json())
      .then(data => {
        const createEntryContainer = document.getElementById("create-entry-container");
        createEntryContainer.innerHTML += `
        <form id="create-entry-form">
          <textarea placeholder="Title" name="title" id="title" cols="60" rows="1"></textarea><br>
          <textarea placeholder="Text" name="content" id="content" cols="60" rows="10"></textarea><br>
          <input type="submit" value="Create">
        </form>`;
        data.forEach(entry => {
          const userEntriesContainer = document.getElementById("user-entries-container");
          userEntriesContainer.innerHTML += `
          <div class="entry" id="entry-${entry.entryID}">
            <h2 id="entry-title-${entry.entryID}">${entry.title}</h2>
            <p id="entry-content-${entry.entryID}">${entry.content}</p>
            <p>${entry.username}</p>
            <p>${entry.createdAt}</p>
            <button data-entryid="${entry.entryID}" class="full-entry-btn">Full Entry</button>
            <button data-entryid="${entry.entryID}" class="edit-entry-btn">Edit</button>
            <button data-entryid="${entry.entryID}" class="delete-entry-btn">Remove</button>
          </div>`;
        })
        userEventListeners.createEntry();
        userEventListeners.editEntry();
        userEventListeners.deleteEntry();
        userEventListeners.goToFullEntry();
      })
      .catch(err => console.log(err));
  },
  users: function(){
    fetch("/api/users")
      .then(resp => resp.json())
      .then(data => {
        const usersContainer = document.getElementById("users-container");
        usersContainer.innerHTML = "<ul>";
        data.forEach(user => {
          usersContainer.innerHTML += `<li>${user.username}</li>`;
        })
        usersContainer.innerHTML += "</ul>";
      })
  }
};

const userEventListeners = {
  goToFullEntry: function(){
    const fullEntry = document.querySelectorAll(".full-entry-btn");
    fullEntry.forEach(entry => {
      entry.addEventListener('click', function (e) {
        const entryID = e.target.dataset.entryid;
        showCorrectView('entry', entryID)
      })
    })
  },
  loadMoreEntries: function(loggedIn){
    const loadBtn = document.getElementById('load-btn');
    const entryContainer = document.getElementById("entry-container");
    loadBtn.addEventListener('click', function () {
      fetch("/api/allentries")
        .then(resp=> resp.json())
        .then(data => {
          loadBtn.style.display = 'none';
          let btn;
          let amountLikes;
          data.forEach(entry => {
            if (loggedIn) {
              btn = `<button data-entryID='${entry.entryID}' class="like-btn">Like</button>`;
            } else {
              btn = `<button data-entryID='${entry.entryID}' disabled>Like</button>`;
            }
            if(entry.likes === null){
              entry.likes = 0;
            }
            amountLikes = `<span class="likes">${entry.likes}</span>`;
            entryContainer.innerHTML +=`
            <div class="entry" id="entry-${entry.entryID}">
              <h3>${entry.title}</h3>
              <p>Written by: <span class="highlight-author">${entry.username}</span></p>
              <p>Posted: ${entry.createdAt}</p>
              <button class="full-entry-btn" data-entryID='${entry.entryID}'>See Full Entry</button>
              ${btn}
              ${amountLikes}
            </div>`;
          })  
          userEventListeners.goToFullEntry();
          userEventListeners.likeComment();
        })
        .catch(err => console.log(err));
    });
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
    const editEntryBtns = document.querySelectorAll(".edit-entry-btn");
    editEntryBtns.forEach(entryBtn => {
      entryBtn.addEventListener("click", e => {
        const entryID = e.target.dataset.entryid;
        const entryContainer = document.querySelector(`#entry-${entryID}`);
        const entryTitle = document.querySelector(`#entry-title-${entryID}`);
        const entryContent = document.querySelector(`#entry-content-${entryID}`);

        const findForm = document.getElementById(`edit-entry-form-${entryID}`);
        if(!findForm){      
          const form = document.createElement("form");
          form.setAttribute("id", `edit-entry-form-${entryID}`);
          const titleTextArea = document.createElement("textarea");
          titleTextArea.setAttribute("name", "title");
          titleTextArea.setAttribute("id", "title");
          titleTextArea.setAttribute("cols", "60");
          titleTextArea.setAttribute("rows", "1");
          titleTextArea.textContent = `${entryTitle.innerText}`;
          const contentTextArea = document.createElement("textarea");
          contentTextArea.setAttribute("name", "content");
          contentTextArea.setAttribute("id", "content");
          contentTextArea.setAttribute("cols", "60");
          contentTextArea.setAttribute("rows", "10");
          contentTextArea.textContent = `${entryContent.innerText}`;
          const formBtn = document.createElement("input");
          formBtn.setAttribute("type", "submit");
          formBtn.setAttribute("value", "confirm");
          const breakElement = document.createElement("br");
          
          form.append(titleTextArea, breakElement, contentTextArea, formBtn);
          entryContainer.append(form);
        } else{
          const editEntryForm = document.getElementById(`edit-entry-form-${entryID}`);
          editEntryForm.style.display = "block";
        }

        const editEntryForm = document.getElementById(`edit-entry-form-${entryID}`);
        editEntryForm.addEventListener("submit", e => {
          e.preventDefault();

          const formData = new FormData(editEntryForm);
          fetch(`/api/edit-entry/${entryID}`, {
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
              entryContent.textContent = data.content;
              entryTitle.textContent = data.title;
              editEntryForm.style.display = "none";
            })
            .catch(err => console.log(err));
        })
      })
    })
  },
  deleteEntry: function(){
    const deleteEntryBtns = document.querySelectorAll(".delete-entry-btn");
    deleteEntryBtns.forEach(deleteBtn => {
      deleteBtn.addEventListener("click", e => {
        e.preventDefault();
        entryID = e.target.dataset.entryid;
        const confirmation = confirm("Are you sure that you want to delete this entry?");
        if(confirmation){
          fetch(`/api/entry/${entryID}`, {
            method: "DELETE"
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
            })
            .catch(err => console.log(err));
        }
      })
    })
  },
  createComment: function(){
    const createCommentBtn = document.querySelector('.create-comment');
    const commentForm = document.getElementById('comment-form')
    createCommentBtn.addEventListener('click',e=>{
      e.preventDefault();
      const entryID = e.target.dataset.entryid
      const formData = new FormData(commentForm);
      fetch(`/api/comment/${entryID}`,{
        method:"POST",
        body:formData
      })
      .then(resp => {
        if(!resp.ok){
          throw new Error(resp.statusText);
        }else{
          return resp.json();
        }
      })
      .then(data => {
          showCorrectView('entry', entryID);
      })
      .catch(err =>console.log(err));
    })
  },
  editComment: function(){
    const editBtns = document.querySelectorAll(".edit-comment-btn");
    editBtns.forEach(editBtn => {
      editBtn.addEventListener("click", e => {
        const commentID = e.target.dataset.commentid;
        const commentContainer = document.getElementById(`comment-${commentID}`);
        const commentContent = document.getElementById(`comment-content-${commentID}`);
        commentContainer.innerHTML += `
          <form class="edit-comment-form" id="edit-comment-form-${commentID}">
            <textarea name="content" cols="60" rows="5">${commentContent.textContent}</textarea><br>
            <input type="submit" value="Confirm">
          </form>`;
        const editCommentForm = document.getElementById(`edit-comment-form-${commentID}`);
        editCommentForm.addEventListener("submit", e => {
          e.preventDefault();
          const formData = new FormData(editCommentForm);
          fetch(`/api/edit-comment/${commentID}`, {
            method: "POST",
            body: formData
          })
            .then(resp => {
              if(!resp.ok){
                throw new Error(resp.statusText);
              } else {
                return resp.json();
              }
            })
            .then(data => {
              console.log(data);
              // Skulle vara bra om man kunde ladda om kommentaren här så att förändringen syns.
              editCommentForm.innerHTML += "<p>" + data.message + "</p>";
            })
            .catch(err => console.log(err));
        })
      })
    });
  },
  deleteComment: function(){
    const deleteBtns = document.querySelectorAll(".delete-comment-btn");
    deleteBtns.forEach(deleteBtn => {
      deleteBtn.addEventListener("click", e => {
        const commentID = e.target.dataset.commentid;
        const commentContainer = document.getElementById(`comment-${commentID}`);

        fetch(`/api/comment/${commentID}`, {
          method: "DELETE"
        })
          .then(resp => {
            if (!resp.ok) {
              throw new Error(resp.statusText);
            } else {
              return resp.json();
            }
          })
          .then(data => {
            commentContainer.innerHTML += "<p>" + data.message + "</p>";
          })
          .catch(err => console.log(err));
      })
    })
  },
  likeComment: function(){
    const likeBtns = document.querySelectorAll(".like-btn");
    likeBtns.forEach(likeBtn => {
      likeBtn.addEventListener("click", e => {
        const entryID = e.target.dataset.entryid;
        fetch(`/api/like/${entryID}`)
          .then(resp => {
            if(!resp.ok){
              throw new Error(resp.statusText);
            }else{
              return resp.json();
            }
          })
          .then(data => {
            likeBtn.parentNode.querySelector('.likes').textContent = data.likes;
          })
          .catch(err => console.log(err));
      });
    })
  }
};

function renderView(view) {
  const target = document.querySelector("main");
  target.innerHTML = "";
  view.forEach(template => {
    const templateMarkup = document.querySelector(template).innerHTML;
    const div = document.createElement("div");
    div.innerHTML = templateMarkup;
    target.append(div);
  });
};

// When entering site we ping to check if the user is logged in or not and show appropriate view
function showCorrectView(view, entryID) {
  fetch("/api/ping")
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      } else {
        return resp.json();
      }
    })
    .then(data => {
      if (data.loggedIn === true) {
        renderView(views[view]);
        viewFetches[view](true, entryID);
      }
    })
    .catch(err => {
      console.log(err);
      renderView(views[view]);
      viewFetches[view](false, entryID);
    });
};
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
      fetch("/api/logout");
      viewFetches.home();
    } else if (viewName === "userEntries"){
      viewFetches.userEntries();
    } else if (viewName === "users"){
      viewFetches.users();
    } else if (viewName === 'trending'){
      showCorrectView('trending');
    }
  });
});

const searchField = document.getElementById('search');
searchField.addEventListener('blur', function(){
fetch(`/api/search/${searchField.value}`)
  .then(resp =>  resp.json())
  .then(data=> {
    console.log(data)
    if (!searchField.value.match(/^[a-zA-Z]+$/)) 
    {
      searchField.style.border = '2px solid red'
      searchField.value = "";
      console.log("prutt")
      return false;
    }
    else{
      renderView(views.search);
      data.forEach(entry=>{
        const searchContainer = document.getElementById("search-container");
        searchField.style.border = '2px solid green'

      searchContainer.innerHTML +=`
          <div class="entry">
            <h3>${entry.title}</h3>
            <p>Written by: <span class="highlight-author">${entry.username}</span></p>
            <p>Posted: ${entry.createdAt}</p>
            <button class="full-entry-btn" data-entryID='${entry.entryID}'>See Full Entry</button>
            ${btn}
          </div>`;
    })
    userEventListeners.goToFullEntry();
  }
  })
})



