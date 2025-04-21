document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');

    // Sample question data (hardcoded from your YAML file)
    const questionData = [
        { text: "Am the life of the party.", scale: "Extraversion", direction: "+" },
        { text: "Feel little concern for others.", scale: "Agreeableness", direction: "-" },
        { text: "Am always prepared.", scale: "Conscientiousness", direction: "+" },
        { text: "Get stressed out easily.", scale: "Emotional Stability", direction: "-" },
        { text: "Have a rich vocabulary.", scale: "Intellect/Imagination", direction: "+" }
    ];

    // Function to calculate the max and min scores for each scale
    function calculateMaxMinScores(questions) {
        const scaleCounts = {};

        // Count the number of questions for each scale
        questions.forEach(question => {
            const scale = question.scale;
            if (!scaleCounts[scale]) {
                scaleCounts[scale] = 0;
            }
            scaleCounts[scale] += 1; // Increment count for this scale
        });

        // Calculate max and min scores based on count
        const maxScores = {};
        const minScores = {};

        Object.keys(scaleCounts).forEach(scale => {
            const count = scaleCounts[scale];
            maxScores[scale] = count * 5; // Max score = count of questions * 5
            minScores[scale] = count * 1; // Min score = count of questions * 1
        });

        return { maxScores, minScores };
    }

    // Main function to calculate score and build UI
    function calculateScores() {
        const scores = {
            "Extraversion": 0,
            "Agreeableness": 0,
            "Conscientiousness": 0,
            "Emotional Stability": 0,
            "Intellect/Imagination": 0
        };

        const { maxScores, minScores } = calculateMaxMinScores(questionData); // Get the max and min scores

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

        // Add bar chart for combined results
        output += `<h4>Personality Traits Bar Chart</h4>
            <canvas id="score-bar-chart" width="400" height="200"></canvas>
        `;

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

        // Create Bar chart for personality traits
        const ctx = document.getElementById("score-bar-chart").getContext("2d");

        const traitLabels = Object.keys(scores);
        const traitScores = Object.values(scores);

        // Calculate the max possible score for the bar chart dynamically
        const maxPossibleScore = Object.values(maxScores).reduce((sum, score) => sum + score, 0);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: traitLabels,
                datasets: [{
                    label: 'Your Scores',
                    data: traitScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: maxPossibleScore, // Dynamically calculated max score
                        title: {
                            display: true,
                            text: `Max Possible Score: ${maxPossibleScore}`
                        }
                    }
                }
            }
        });
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
