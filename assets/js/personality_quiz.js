document.addEventListener('DOMContentLoaded', function () {
    // ASSUMPTION: The Chart.js library is no longer needed on the quiz page.
    const form = document.getElementById('quiz-form');

    // ASSUMPTION: The following data objects are assumed to exist in the global scope,
    // injected from the Jekyll-processed YAML files.
    const scaleColors = window.personalityData.scaleColors;

    // A mapping of the full trait pairs to their one-letter codes.
    const traitCodeMap = {
        "Open vs Traditional": { positive: "O", negative: "T" },
        "Disciplined vs Spontaneous": { positive: "D", negative: "S" },
        "Social vs Reserved": { positive: "O", negative: "R" },
        "Easygoing vs Assertive": { positive: "E", negative: "A" },
        "Calm vs Passionate": { positive: "C", negative: "P" }
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
        const params = new URLSearchParams();

        questions.forEach((tr, index) => {
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
                // Store the answered question in URL parameters
                params.set(`q${index}`, selectedRadio.value);
            }
        });

        const requiredScales = Object.keys(scores);
        const missingScales = requiredScales.filter(scale => answeredCounts[scale] === 0);

        if (missingScales.length > 0) {
            alert(`Please answer at least one question for each personality trait to get your result. You are missing questions for the following traits: ${missingScales.join(', ')}.`);
            return;
        }

        const { maxScores, minScores } = calculateMaxMinScores(answeredQuestionsData);
        const thresholds = {};
        for (const scale in maxScores) {
            thresholds[scale] = (maxScores[scale] + minScores[scale]) / 2;
        }

        let finalCode = "";
        const traitPairs = [
            "Open vs Traditional",
            "Disciplined vs Spontaneous",
            "Social vs Reserved",
            "Easygoing vs Assertive",
            "Calm vs Passionate"
        ];
        traitPairs.forEach(scaleName => {
            const score = scores[scaleName];
            const threshold = thresholds[scaleName];
            const codes = traitCodeMap[scaleName];
            if (score > threshold) {
                finalCode += codes.positive;
            } else {
                finalCode += codes.negative;
            }
        });

        finalCode = finalCode.split("").join("-");

        // Redirect to the new results page, preserving parameters
        window.location.href = `/results/${finalCode}/?${params.toString()}`;
    }

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

    // Event listener for the form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateScores();
    });

    colorQuestions();
});