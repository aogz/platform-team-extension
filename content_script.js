console.log("Initialized!");
surflyExtension.surflySession.onMessage.addListener((message, sender) => {
  console.log("Content script received message", message);
  if (message.type === "rest") {
    if (message.action === "question") {
      (function (question) {
        // Create a style element for the overlay text
        const style = document.createElement("style");
        style.innerHTML = `
            .overlay-text {
                position: fixed;
                top: 20px;
                right: 20px;
                font-size: 3rem;
                color: white;
                background-color: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border-radius: 10px;
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);

        // Create the text overlay
        const textOverlay = document.createElement("div");
        textOverlay.className = "overlay-text";
        textOverlay.textContent = question;
        document.body.appendChild(textOverlay);

        // Remove the overlay after 3 seconds
        setTimeout(() => {
          textOverlay.remove();
          style.remove();
        }, 3000);
      })(message.content);
    } else if (message.action === "reaction") {
      (function (content) {
        // Create a style element for the falling emojis
        const style = document.createElement("style");
        style.innerHTML = `
              @keyframes fall {
                  to { transform: translateY(100vh); }
              }
              .emoji {
                  position: fixed;
                  top: -50px;
                  font-size: 2rem;
                  animation: fall linear infinite;
              }
          `;
        document.head.appendChild(style);

        // Function to generate random positions
        function getRandomPosition() {
          return Math.floor(Math.random() * window.innerWidth) + "px";
        }

        // Create an overlay
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = 9999;
        document.body.appendChild(overlay);

        // Function to create falling emojis
        function createFallingEffect() {
          for (let i = 0; i < 30; i++) {
            const emoji = document.createElement("div");
            emoji.textContent = content;
            emoji.className = "emoji";
            emoji.style.left = getRandomPosition();
            emoji.style.animationDuration = Math.random() * 3 + 2 + "s";
            emoji.style.animationDelay = Math.random() * 3 + "s";
            overlay.appendChild(emoji);

            // Remove emoji after animation ends
            emoji.addEventListener("animationend", () => {
              emoji.remove();
            });
          }
        }

        // Start creating falling emojis
        createFallingEffect();

        // Remove overlay after 3 seconds
        setTimeout(() => {
          overlay.remove();
          style.remove();
        }, 3000);
      })(message.content);
    }
  }
});
