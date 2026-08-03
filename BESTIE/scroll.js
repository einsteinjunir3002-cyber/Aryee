document.addEventListener("DOMContentLoaded", function() {
    const btn = document.createElement("button");
    btn.innerHTML = "⬇️";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.style.background = "rgba(255, 105, 180, 0.7)";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "50%";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.fontSize = "24px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    btn.style.display = "none";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.transition = "all 0.3s ease";
    
    document.body.appendChild(btn);

    const checkScrollable = () => {
        if (document.documentElement.scrollHeight > window.innerHeight) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    };
    
    setTimeout(checkScrollable, 500);
    window.addEventListener("resize", checkScrollable);

    let isAtBottom = false;

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        if (scrolled >= maxScroll - 10) {
            isAtBottom = true;
            btn.innerHTML = "⬆️";
        } else {
            isAtBottom = false;
            btn.innerHTML = "⬇️";
        }
    });

    btn.addEventListener("click", () => {
        if (isAtBottom) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        }
    });
});
