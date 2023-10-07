document.addEventListener("DOMContentLoaded", function () {
  const newPostForm = document.getElementById("newPostForm");
  const adminPostList = document.getElementById("adminPostList");
  const postEditor = document.getElementById("postEditor");

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
          showPostInEditor(post);
        });
        adminPostList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function showPostInEditor(post) {
    postEditor.innerHTML = `
        <h2>Rediger innlegg</h2>
        Tittel: <input type="text" id="editTitle" value="${post.title}">
        Innhold: <textarea id="editContent">${post.content}</textarea>
        <button id="saveEdit">Lagre endringer</button>
        <button id="deletePost">Slett</button>
      `;

    document
      .getElementById("saveEdit")
      .addEventListener("click", async function () {
        const updatedTitle = document.getElementById("editTitle").value;
        const updatedContent = document.getElementById("editContent").value;
        try {
          const response = await fetch(`/api/edit-post/${post.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: updatedTitle,
              content: updatedContent,
            }),
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
          } else {
            alert("Kunne ikke slette innlegget.");
          }
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      });
  }

  newPostForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
      const response = await fetch("/admin/api/new-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      console.log("Response from server:", response);
      const newPost = await response.json();
      const listItem = document.createElement("li");
      const date = newPost.dateCreated
        ? new Date(newPost.dateCreated).toLocaleDateString()
        : "Ukjent dato";
      listItem.innerHTML = `<strong>${newPost.title}</strong> - ${date}`;

      listItem.addEventListener("click", function () {
        showPostInEditor(newPost);
      });
      adminPostList.appendChild(listItem);
    } catch (error) {
      console.error("Error adding new post:", error);
    }
  });

  fetchPosts();
});
