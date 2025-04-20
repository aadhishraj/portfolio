document.addEventListener("DOMContentLoaded", function () {
  // Typing animation
  const words = ["<web developer/>", "<tech enthusiast/>", "<problem solver/>"];
  let i = 0;
  const typedText = document.querySelector(".typed-text");

  function typeWord() {
    typedText.textContent = words[i];
    i = (i + 1) % words.length;
  }

  typeWord();
  setInterval(typeWord, 1500);

  // Slideshow functionality
  let currentImage = 0;
  const images = document.querySelectorAll(".project-box a");
  const totalImages = images.length;

  function changeImage() {
    images.forEach((image) => {
      image.style.display = "none";
    });
    if (images.length > 0) {
      images[currentImage].style.display = "block";
      currentImage = (currentImage + 1) % totalImages;
    }
  }

  // Form submit logic
  const form = document.getElementById("contactForm");
  const loadingPopup = document.getElementById("loadingPopup");
  let loading = false;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value,
      };

      try {
        loading = true;
        if (loadingPopup) loadingPopup.style.display = "block";

        const res = await fetch("server.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (loadingPopup) loadingPopup.style.display = "none";

        if (res.ok) {
          alert("✅ Message sent successfully!");
          form.reset();
        } else {
          alert("❌ Error: " + result.error);
        }
        loading = false;
      } catch (error) {
        if (loadingPopup) loadingPopup.style.display = "none";
        alert("❌ Submission failed!");
        console.error(error);
      }
    });
  }

  // Initial slideshow image
  changeImage();
  setInterval(changeImage, 1000);
});
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.querySelector('.vertical-nav').classList.toggle('dark-mode');
  
  // Change the button icon if needed (sun/moon)
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️'; // Change to sun icon in dark mode
  } else {
    darkModeToggle.textContent = '🌙'; // Change to moon icon in light mode
  }
});
