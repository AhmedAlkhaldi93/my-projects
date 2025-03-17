document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card"); // تحديد كل الكروت

    cards.forEach((card) => {
        card.addEventListener("click", function () {
            this.classList.toggle("flipped"); // قلب الكرت عند النقر
        });
    });
});
