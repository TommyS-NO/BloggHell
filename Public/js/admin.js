// ---------------------
// Admin Autorisering Funksjon
// ---------------------

function handleAdminLogin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;
  adminLogin(username, password);
}

async function adminLogin(username, password) {
  try {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      hideLoginPopup();
      showAdminFeatures();
      loadAdminPosts();
    } else {
      alert("Feil Brukernavn eller Passord😒");
    }
  } catch (error) {
    console.error("Error, Ingen Tilgang🤫", error);
  }
}

async function adminLogout() {
  try {
    const response = await fetch("/admin/logout");
    if (response.ok) {
      hideAdminFeatures();
      location.reload();
    }
  } catch (error) {
    console.error("Feil under utlogging:", error);
  }
}
// ---------------------
// Admin UI Funksjoner
// ---------------------

function showLoginPopup() {
  const loginPopup = document.getElementById("loginPopup");
  const overlay = document.querySelector(".login-popup-overlay");
  loginPopup.style.display = "block";
  overlay.style.display = "block";
  document.getElementById("adminUsername").focus();
}

function hideLoginPopup() {
  const loginPopup = document.getElementById("loginPopup");
  const overlay = document.querySelector(".login-popup-overlay");
  loginPopup.style.display = "none";
  overlay.style.display = "none";
}

function showAdminFeatures() {
  const bioInfo = document.getElementById("bioInfo");
  const adminCreatePost = document.getElementById("adminCreatePost");
  const header = document.querySelector("header");
  const titleElement = document.querySelector("header h1");
  titleElement.textContent = "BloggHell";
  const subTitleElement = document.createElement("h2");
  subTitleElement.textContent = "Admin Site";
  header.appendChild(subTitleElement);
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logg ut";
  logoutButton.className = "admin-logout-button";
  logoutButton.onclick = adminLogout;
  header.appendChild(logoutButton);

  bioInfo.style.display = "none";
  adminCreatePost.style.display = "block";
}

function hideAdminFeatures() {
  const bioInfo = document.getElementById("bioInfo");
  const adminCreatePost = document.getElementById("adminCreatePost");
  const header = document.querySelector("header");
  const subTitleElement = header.querySelector("h2");
  const logoutButton = header.querySelector("button");

  if (subTitleElement) subTitleElement.remove();
  if (logoutButton) logoutButton.remove();

  bioInfo.style.display = "block";
  adminCreatePost.style.display = "none";
}
// ---------------------
// Post CRUD Funksjoner
// ---------------------

function submitNewPost() {
  const title = document.getElementById("adminPostTitle").value.trim();
  const content = document.getElementById("adminPostContent").value.trim();

  if (!title || !content) {
    alert("Vennligst fyll ut både tittel og innhold 🫵");
    return;
  }

  createPost(title, content);
  document.getElementById("adminPostTitle").value = "";
  document.getElementById("adminPostContent").value = "";
}

async function createPost(title, content) {
  try {
    const response = await fetch("/admin/create-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("Nytt Innlegg Lastet opp😃💵");
      loadAdminPosts();
    } else {
      alert("Error creating post💩");
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
function submitEditPost(postId, title, content) {
  const confirmation = confirm(
    "Er du sikker på at du vil redigere dette innlegget? 🤔"
  );
  if (!confirmation) return;
  updatePost(postId, title, content);
}

async function updatePost(id, title, content) {
  try {
    const response = await fetch(`/admin/update-post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("Oppdatert 👏");
      loadAdminPosts();
    } else {
      alert("Error updating post.");
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

async function deletePost(id) {
  const confirmation = confirm("Er du sikker på at du vil slette?🤔");
  if (!confirmation) return;
  try {
    const response = await fetch(`/admin/delete-post/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Poff 💣 Borte.");
      loadAdminPosts();
    } else {
      alert("Error deleting post💩");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

async function loadAdminPosts() {
  try {
    const response = await fetch("/admin/get-all-posts");
    const posts = await response.json();
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = "";

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post-item";
      postElement.id = `post-${post.id}`;
      postElement.innerHTML = `
              <h3 class="post-title">${post.title}</h3>
              <p class="post-content">${post.content}</p>
              <p class="post-date">Opprettet: ${new Date(
                post.dateCreated
              ).toLocaleString()}</p>
              ${
                post.lastEdited
                  ? `<p class="post-last-edited">Sist redigert: ${new Date(
                      post.lastEdited
                    ).toLocaleString()}</p>`
                  : ""
              }
              <p class="post-likes">Likes: ${post.likes}</p>
              <div class="admin-buttons">
                  <button class="edit" onclick="showEditPostForm(${
                    post.id
                  })">Rediger</button>
                  <button class="delete" onclick="deletePost(${
                    post.id
                  })">Slett</button>
              </div>
              <p class="post-comments-title">Kommentarer:</p>
              <ul class="post-comments-list">
                  ${post.comments
                    .map(
                      (comment) =>
                        `<li class="post-comment"><strong>${
                          comment.name
                        }</strong> (${new Date(
                          comment.time
                        ).toLocaleString()}): <strong>${
                          comment.content
                        }</strong> <button class="comment-delete" onclick="deleteComment(${
                          post.id
                        }, '${comment.time}')">Slett</button></li>`
                    )
                    .join("")}
              </ul>
          `;
      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

async function showEditPostForm(postId) {
  const postElement = document.querySelector(`#post-${postId}`);
  const postTitle = postElement.querySelector(".post-title");
  const postContent = postElement.querySelector(".post-content");
  const editButton = postElement.querySelector(".edit");
  const deleteButton = postElement.querySelector(".delete");

  if (postElement.querySelector(".edit-buttons-container")) {
    return;
  }

  editButton.style.display = "none";
  deleteButton.style.display = "none";

  postTitle.setAttribute("contenteditable", "true");
  postContent.setAttribute("contenteditable", "true");
  postTitle.focus();

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "edit-buttons-container";

  const saveButton = document.createElement("button");
  saveButton.textContent = "Lagre";
  saveButton.className = "admin-save-button";
  saveButton.onclick = () => {
    submitEditPost(postId, postTitle.textContent, postContent.textContent);
    postTitle.removeAttribute("contenteditable");
    postContent.removeAttribute("contenteditable");
    buttonsContainer.remove();

    editButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
  };

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Avbryt";
  cancelButton.className = "admin-abort-button";
  cancelButton.onclick = () => {
    postTitle.removeAttribute("contenteditable");
    postContent.removeAttribute("contenteditable");
    buttonsContainer.remove();

    editButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
  };

  buttonsContainer.appendChild(saveButton);
  buttonsContainer.appendChild(cancelButton);
  postElement.insertBefore(buttonsContainer, postContent.nextSibling);
}

async function deleteComment(postId, commentTime) {
  const confirmation = confirm("Er du sikker på at du vil slette?🤔");
  if (!confirmation) return;
  try {
    const response = await fetch(
      `/admin/delete-comment/${postId}?time=${commentTime}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("Kommentar slettet");
      loadAdminPosts();
    } else {
      alert("Feil ved sletting av kommentar💩");
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}
