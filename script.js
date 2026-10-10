document.addEventListener("DOMContentLoaded", () => {
    // 1. 메인 타이틀 자동 타이핑 효과
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = "";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80); // 타이핑 속도 조절
            }
        }
        
        setTimeout(typeWriter, 300); // 페이지 로드 후 0.3초 뒤 시작
    }

    // 2. 스크롤 시 카드가 부드럽게 나타나는 인터랙션 (Observer)
    const cards = document.querySelectorAll(".project-card, .skill-box, .contact-card");
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease, border-color 0.4s ease, box-shadow 0.4s ease";
        observer.observe(card);
    });
});
