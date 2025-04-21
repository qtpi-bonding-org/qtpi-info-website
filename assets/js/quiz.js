document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');

    // Main function to calculate score and build UI
    function calculateScores() {
        const scores = {
            "Extraversion": 0,
            "Agreeableness": 0,
            "Conscientiousness": 0,
            "Emotional Stability": 0,
            "Intellect/Imagination": 0
        };

        const questions = form.querySelectorAll('tr');

        questions.forEach((tr, index) => {
            const radios = tr.querySelectorAll('input[type="radio"]');

            radios.forEach((radio) => {
                const scale = radio.getAttribute('data-scale');
                const direction = radio.getAttribute('data-direction');

                if (radio.checked) {
                    let value = parseInt(radio.value, 10);
                    if (direction === '-') value = 6 - value;

                    if (scale) {
                        scores[scale] += value;
                    }
                }
            });
        });

        // Display score results
        let output = `<h3>Your Results</h3><ul>`;
        for (const trait in scores) {
            output += `<li><strong>${trait}:</strong> ${scores[trait]}</li>`;
        }
        output += `</ul>`;

        // Generate shareable URL using selected answers
        const params = new URLSearchParams();
        questions.forEach((tr, index) => {
            const selected = tr.querySelector('input[type="radio"]:checked');
            if (selected) {
                params.set(`q${index}`, selected.value);
            }
        });

        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?${params.toString()}`;

        // Add share input and copy button
        output += `
            <p><strong>Share your results:</strong></p>
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input id="share-url" type="text" value="${shareUrl}" readonly style="flex: 1; padding: 5px;">
                <button id="copy-link">Copy</button>
            </div>
            <p>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my personality results! ' + shareUrl)}" target="_blank" class="fa-stack">
                    <i class="fa-brands fa-x-twitter fa-stack-1x"></i>
                </a>
                <a href="https://bsky.app/intent/compose?text=${encodeURIComponent('Check out my personality results! ' + shareUrl)}" target="_blank" class="fa-stack">
                    <i class="fa-brands fa-bluesky fa-stack-1x"></i>
                </a>
                <a href="https://www.threads.net/share?text=${encodeURIComponent('Check out my personality results! ' + shareUrl)}" target="_blank" class="fa-stack">
                    <i class="fa-brands fa-threads fa-stack-1x"></i>
                </a>
                <a href="https://mastodon.social/share?text=${encodeURIComponent('Check out my personality results! ' + shareUrl)}" target="_blank" class="fa-stack">
                    <i class="fa-brands fa-mastodon fa-stack-1x"></i>
                </a>
                <a href="${shareUrl}" target="_blank">🔗 View Your Results</a>
            </p>
        `;

        resultDiv.innerHTML = output;

        // Enable copy functionality
        setTimeout(() => {
            const copyBtn = document.getElementById('copy-link');
            const shareInput = document.getElementById('share-url');

            if (copyBtn && shareInput) {
                copyBtn.addEventListener('click', () => {
                    shareInput.select();
                    document.execCommand('copy');
                    copyBtn.innerText = 'Copied!';
                    setTimeout(() => copyBtn.innerText = 'Copy', 2000);
                });
            }
        }, 0);
    }

    // Fill in answers based on URL params like ?q1=4&q2=2...
    function autofillFromURL() {
        const params = new URLSearchParams(window.location.search);
        const questions = form.querySelectorAll('tr');
        let filledAny = false;

        questions.forEach((tr, index) => {
            const paramKey = `q${index}`;
            const value = params.get(paramKey);
            if (value) {
                const radios = tr.querySelectorAll('input[type="radio"]');
                radios.forEach((radio) => {
                    if (radio.value === value) {
                        radio.checked = true;
                        filledAny = true;
                    }
                });
            }
        });

        if (filledAny) {
            calculateScores(); // auto-show results if URL had data
        }
    }

    // On submit, calculate results
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateScores();
    });

    // On page load, check for answers in URL
    autofillFromURL();
});
