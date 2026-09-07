function changeFace() {
    const face = document.querySelector("#face");
    if (face.src.includes("photo_2025-04-08_16-50-18.jpg")) {
        face.src = "side.jpg";
    } else {
        face.src = "photo_2025-04-08_16-50-18.jpg";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const links = {
        idea1: "https://adreyguy.github.io/se1400/milestone7/",
        idea2: "https://utahtech.dserec.com/online/clubsports",
        idea3: "https://www.vulkan.org"
    };

    for (const [id, url] of Object.entries(links)) {
        const item = document.getElementById(id);
        if (item) {
            item.addEventListener("click", () => {
                window.open(url, "_blank");
            });
        }
    }
});