document.addEventListener('DOMContentLoaded', function () {
    // ASSUMPTION: The Chart.js library (for the bar chart) and the necessary HTML elements
    // (like 'quiz-form', 'result', and the table structure with data attributes)
    // are assumed to exist in the environment.

    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');

    // ASSUMPTION: The following data objects are assumed to exist in the global scope,
    // injected from the Jekyll-processed YAML files.
    const pieData = window.personalityData.piePersonalities;
    const traitExplanations = window.personalityData.traitExplanations;
    const scaleColors = window.personalityData.scaleColors;

    // A mapping of the full trait pairs to their one-letter codes.
    const traitCodeMap = {
        "Open vs Traditional": { positive: "O", negative: "T" },
        "Disciplined vs Spontaneous": { positive: "D", negative: "S" },
        "Social vs Reserved": { positive: "O", negative: "R" },
        "Easygoing vs Assertive": { positive: "E", negative: "A" },
        "Calm vs Passionate": { positive: "C", negative: "P" }
    };

    // A mapping of the full trait pairs to their descriptive names for the results output.
    const traitNameMap = {
        "Open vs Traditional": { positive: "Open", negative: "Traditional" },
        "Disciplined vs Spontaneous": { positive: "Disciplined", negative: "Spontaneous" },
        "Social vs Reserved": { positive: "Social", negative: "Reserved" },
        "Easygoing vs Assertive": { positive: "Easygoing", negative: "Assertive" },
        "Calm vs Passionate": { positive: "Calm", negative: "Passionate" }
    };


    // Function to apply colors to each question row based on its scale
    function colorQuestions() {
        const questions = form.querySelectorAll('tr');
        questions.forEach((tr) => {
            const radio = tr.querySelector('input[type="radio"]');
            if (radio) {
                const scale = radio.getAttribute('data-scale');
                const color = scaleColors[scale];
                if (color) {
                    tr.querySelector('td:first-child').style.backgroundColor = color;
                    tr.querySelector('td:first-child').style.color = 'white';
                    tr.querySelector('td:first-child').style.padding = '8px';
                }
            }
        });
    }

    function calculateScores() {
        const scores = {
            "Social vs Reserved": 0,
            "Easygoing vs Assertive": 0,
            "Disciplined vs Spontaneous": 0,
            "Calm vs Passionate": 0,
            "Open vs Traditional": 0
        };

        const answeredCounts = {
            "Social vs Reserved": 0,
            "Easygoing vs Assertive": 0,
            "Disciplined vs Spontaneous": 0,
            "Calm vs Passionate": 0,
            "Open vs Traditional": 0
        };

        const questions = form.querySelectorAll('tr');

        const answeredQuestionsData = [];

        questions.forEach((tr) => {
            const selectedRadio = tr.querySelector('input[type="radio"]:checked');
            if (selectedRadio) {
                const scale = selectedRadio.getAttribute('data-scale');
                const direction = selectedRadio.getAttribute('data-direction');
                let value = parseInt(selectedRadio.value, 10);
                if (direction === '-') value = 6 - value;
                if (scale) {
                    scores[scale] += value;
                    answeredCounts[scale]++;
                    answeredQuestionsData.push({ scale, direction });
                }
            }
        });

        const requiredScales = Object.keys(scores);
        const missingScales = requiredScales.filter(scale => answeredCounts[scale] === 0);

        if (missingScales.length > 0) {
            resultDiv.innerHTML = `<p style="color: red;">
                Please answer at least one question for each personality trait to get your result.
                You are missing questions for the following traits: <strong>${missingScales.join(', ')}</strong>.
            </p>`;
            return;
        }

        const { maxScores, minScores } = calculateMaxMinScores(answeredQuestionsData);

        const thresholds = {};
        for (const scale in maxScores) {
            thresholds[scale] = (maxScores[scale] + minScores[scale]) / 2;
        }

        let finalCode = "";
        let displayCode = "";
        let finalTraitsOutput = "";

        const traitPairs = [
            "Open vs Traditional",
            "Disciplined vs Spontaneous",
            "Social vs Reserved",
            "Easygoing vs Assertive",
            "Calm vs Passionate"
        ];

        traitPairs.forEach((scaleName, index) => {
            const score = scores[scaleName];
            const threshold = thresholds[scaleName];
            const codes = traitCodeMap[scaleName];
            const names = traitNameMap[scaleName];

            if (score > threshold) {
                finalCode += codes.positive;
                displayCode += codes.positive;
                finalTraitsOutput += `<li>You are a **${names.positive}** person.</li>`;
            } else if (score < threshold) {
                finalCode += codes.negative;
                displayCode += codes.negative;
                finalTraitsOutput += `<li>You are a **${names.negative}** person.</li>`;
            } else { // It's a tie
                finalCode += codes.negative; // Use a valid letter for the lookup
                displayCode += `?${codes.negative}?`;
                finalTraitsOutput += `<li>You are a mix of **${names.positive}** and **${names.negative}**.</li>`;
            }
            if (index < traitPairs.length - 1) {
                finalCode += "-";
                displayCode += "-";
            }
        });

        const pieResult = pieData[finalCode];

        if (!pieResult) {
            resultDiv.innerHTML = `<p>Error: Could not calculate your pie type. An invalid code was generated: ${finalCode}. Please ensure your personality data is configured correctly.</p>`;
            return;
        }

        // --- Build the Result UI ---
        let pieName = pieResult.pieType.toLowerCase();
        let filename = pieName.replace(/ /g, "_") + '.svg';
        const imageUrl = `https://assets.qtpi.app/cutie_pie/${encodeURIComponent(filename)}`;

        let traitList = `<ul>${finalTraitsOutput}</ul>`;

        const params = new URLSearchParams();
        questions.forEach((tr, index) => {
            const selected = tr.querySelector('input[type="radio"]:checked');
            if (selected) {
                params.set(`q${index}`, selected.value);
            }
        });
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?${params.toString()}`;

        let output = `
            <div class="result-container">
                <h2>You are a ${pieResult.pieType}!</h2>
                <img src="${imageUrl}" alt="${pieResult.pieType}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
                <p><em>"${pieResult.reasoning}"</em></p>
                <p>${pieResult.blurb}</p>
                <hr>
                <h3>Your Personality Code: ${displayCode}</h3>
                ${traitList}
                <h4>Your Trait Scores</h4>
                <canvas id="score-bar-chart" width="400" height="200"></canvas>
                <p><strong>Share your results:</strong></p>
                <div style="margin-bottom: 10px;">
                    <input id="share-url" type="text" value="${shareUrl}" readonly style="width: 100%; padding: 5px;">
                </div>
                <p>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank" class="fa-stack">
                        <i class="fa-brands fa-x-twitter fa-stack-1x"></i>
                    </a>
                    <a href="https://bsky.app/intent/compose?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank" class="fa-stack">
                        <i class="fa-brands fa-bluesky fa-stack-1x"></i>
                    </a>
                    <a href="https://www.threads.net/share?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank" class="fa-stack">
                        <i class="fa-brands fa-threads fa-stack-1x"></i>
                    </a>
                    <a href="https://mastodon.social/share?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank" class="fa-stack">
                        <i class="fa-brands fa-mastodon fa-stack-1x"></i>
                    </a>
                    <a href="javascript:void(0);" onclick="navigator.clipboard.writeText('${shareUrl}'); alert('Link copied!');" title="Copy link"><i class="fa-solid fa-copy"></i> Copy</a>
                </p>
            </div>
        `;
        resultDiv.innerHTML = output;

        // Create Bar chart
        const ctx = document.getElementById("score-bar-chart").getContext("2d");
        const traitLabels = Object.keys(scores);
        const traitScores = Object.values(scores);
        const maxScoresForChart = Object.values(maxScores);

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
                        max: Math.max(...maxScoresForChart),
                        title: { display: true, text: 'Scores' }
                    }
                }
            }
        });
    }

    // Function to calculate max/min scores based on the questions that were answered.
    function calculateMaxMinScores(answeredQuestions) {
        const scaleCounts = {};
        answeredQuestions.forEach(question => {
            const scale = question.scale;
            if (!scaleCounts[scale]) {
                scaleCounts[scale] = 0;
            }
            scaleCounts[scale] += 1;
        });

        const maxScores = {};
        const minScores = {};
        Object.keys(scaleCounts).forEach(scale => {
            const count = scaleCounts[scale];
            maxScores[scale] = count * 5;
            minScores[scale] = count * 1;
        });

        return { maxScores, minScores };
    }

    function autofillFromURL() {
        const params = new URLSearchParams(window.location.search);
        if (params.toString()) {
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
                calculateScores();
            }
        }
    }

    // --- Event Listeners and Initial Functions ---
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateScores();
    });

    colorQuestions();
    autofillFromURL();
});