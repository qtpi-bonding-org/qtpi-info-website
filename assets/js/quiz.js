document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');

    // Calculate and show results
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
                    if (direction === '-') value = -value;

                    if (scale) {
                        scores[scale] += value;
                    }
                }
            });
        });

        // Display scores
        let output = `<h3>Your Results</h3><ul>`;
        for (const trait in scores) {
            output += `<li><strong>${trait}:</strong> ${scores[trait]}</li>`;
        }
        output += `</ul>`;

        // Build shareable URL with answers
        const params = new URLSearchParams();
        questions.forEach((tr, index) => {
            const selected = tr.querySelector('input[type="radio"]:checked');
            if (selected) {
                params.set(`q${index + 1}`, selected.value);
            }
        });

        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?${params.toString()}`;

        output += `
            <p><strong>Share your results:</strong></p>
            <input type="text" value="${shareUrl}" readonly style="width:100%;padding:5px;" onclick="this.select();">
            <p><a href="${shareUrl}" target="_blank">View Your Results</a></p>
        `;

        resultDiv.innerHTML = output;
    }

    // Auto-fill form from URL
    function autofillFromURL() {
        const params = new URLSearchParams(window.location.search);

        const questions = form.querySelectorAll('tr');
        let filledAny = false;

        questions.forEach((tr, index) => {
            const paramKey = `q${index + 1}`;
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
            calculateScores(); // auto-show results if values were found
        }
    }

    // On submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateScores();
    });

    // On page load
    autofillFromURL();
});
