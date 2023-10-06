document.addEventListener("DOMContentLoaded", function () {
  const newPostForm = document.getElementById("newPostForm");
  const adminPostList = document.getElementById("adminPostList");

  async function fetchPosts() {
    try {
      const response = await fetch("/api/posts");
      const posts = await response.json();
      adminPostList.innerHTML = "";
      posts.forEach((post) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${post.title}</strong> - ${new Date(
          post.dateCreated
        ).toLocaleDateString()}`;
        listItem.addEventListener("click", function () {
          showPostInPopup(post);
        });
        adminPostList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function showPostInPopup(post) {
    const popup = document.createElement("div");
    popup.classList.add("post-popup");
    popup.innerHTML = `
              <h2>${post.title}</h2>
              <p>${post.content}</p>
              <button id="editPost">Rediger</button>
              <button id="deletePost">Slett</button>
              <button id="closePopup">Lukk</button>
          `;
    document.body.appendChild(popup);

    document
      .getElementById("editPost")
      .addEventListener("click", async function () {
        const title = prompt("Endre tittel:", post.title);
        const content = prompt("Endre innhold:", post.content);
        if (title && content) {
          try {
            const response = await fetch(`/api/edit-post/${post.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, content }),
            });
            if (response.ok) {
              alert("Innlegget ble oppdatert.");
              fetchPosts();
            } else {
              alert("Kunne ikke oppdatere innlegget.");
            }
          } catch (error) {
            console.error("Error updating post:", error);
          }
        }
      });

    document
      .getElementById("deletePost")
      .addEventListener("click", async function () {
        try {
          const response = await fetch(`/api/delete-post/${post.id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            alert("Innlegget ble slettet.");
            fetchPosts();
            document.body.removeChild(popup);
          } else {
            alert("Kunne ikke slette innlegget.");
          }
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      });

    document
      .getElementById("closePopup")
      .addEventListener("click", function () {
        document.body.removeChild(popup);
      });
  }

  newPostForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
      const response = await fetch("/api/new-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const newPost = await response.json();
      const listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${newPost.title}</strong> - ${new Date(
        newPost.dateCreated
      ).toLocaleDateString()}`;
      listItem.addEventListener("click", function () {
        showPostInPopup(newPost);
      });
      adminPostList.appendChild(listItem);
    } catch (error) {
      console.error("Error adding new post:", error);
    }
  });

  fetchPosts();
});
