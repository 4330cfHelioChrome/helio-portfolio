document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('code-sections-container');
    if (!container) return;

    // HTML 태그에 적힌 data-json 속성 값 가져오기
    const jsonFile = container.getAttribute('data-json');
    if (!jsonFile) {
        console.error('No JSON file specified in data-json attribute.');
        return;
    }

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = ''; // 로딩 문구 제거

            data.sections.forEach((section, index) => {
                const details = document.createElement('details');
                // 1. 애니메이션이 바로 나타나도록 'visible' 추가 및 순서(--i) 지정
                details.className = 'project-card visible';
                details.style.setProperty('--i', index);
                details.style.padding = '20px';
                details.style.cursor = 'pointer';

                let itemsHtml = '';
                section.items.forEach(item => {
                    itemsHtml += `
                        <div style="background: #111; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                            <h4 style="color: #38ef7d; margin-bottom: 6px; font-family: monospace;">${item.title}</h4>
                            <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${item.description}</p>
                            <pre style="background: #000; padding: 12px; border-radius: 6px; overflow-x: auto; color: #f8f8f2; font-family: monospace; font-size: 0.85rem; margin: 0;"><code>${item.code}</code></pre>
                        </div>
                    `;
                });

                details.innerHTML = `
                    <summary style="font-size: 1.2rem; font-weight: bold; color: #fff; outline: none;">${section.title}</summary>
                    <div style="margin-top: 16px; border-top: 1px solid #333; padding-top: 16px; cursor: default;">
                        <p style="color: #aaa; margin-bottom: 16px;">${section.description}</p>
                        ${itemsHtml}
                    </div>
                `;

                // 2. 동적으로 생성된 카드에 3D 틸트 및 마우스 반사 효과 적용
                setupCardTilt(details);

                container.appendChild(details);
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            if (container) {
                container.innerHTML = '<p style="color: #ff6b6b;">Failed to load codes.</p>';
            }
        });
});

// 3D 틸트 효과를 카드에 적용해 주는 함수 (script.js의 효과와 동일)
function setupCardTilt(card) {
    card.addEventListener("mousemove", (e) => {
        card.style.transition = "none";
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = -((y - centerY) / centerY) * 12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });

    card.addEventListener("mouseenter", () => {
        card.style.transition = "none";
    });
}
