document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('code-sections-container');
    if (!container) return;

    // HTML 태그에 적힌 data-json 속성 값(예: python-data.json)을 가져옴
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

            data.sections.forEach(section => {
                const details = document.createElement('details');
                details.className = 'project-card';
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
