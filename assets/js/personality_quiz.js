document.addEventListener('DOMContentLoaded', function () {
    // ASSUMPTION: The quiz form with id 'quiz-form', the error div with id 'quiz-error',
    // and the window.quizData object (containing scaleColors) are assumed to exist in the HTML.

    const form = document.getElementById('quiz-form');
    const errorDiv = document.getElementById('quiz-error');
    const scaleColors = window.quizData.scaleColors;

    const traitCodeMap = {
        "Open vs Traditional": { positive: "O", negative: "T" },
        "Disciplined vs Spontaneous": { positive: "D", negative: "S" },
        "Social vs Reserved": { positive: "O", negative: "R" },
        "Easygoing vs Assertive": { positive: "E", negative: "A" },
        "Calm vs Passionate": { positive: "C", negative: "P" }
    };

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

    function calculateAndRedirect() {
        const scores = {
            "Social vs Reserved": 0, "Easygoing vs Assertive": 0,
            "Disciplined vs Spontaneous": 0, "Calm vs Passionate": 0,
            "Open vs Traditional": 0
        };
        const answeredCounts = { ...scores };
        const answeredQuestionsData = [];
        const params = new URLSearchParams();

        const questionRows = form.querySelectorAll('tbody tr');
        questionRows.forEach((tr, index) => {
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
                params.set(`q${index}`, selectedRadio.value);
            }
        });

        const requiredScales = Object.keys(scores);
        const missingScales = requiredScales.filter(scale => answeredCounts[scale] === 0);
        if (missingScales.length > 0) {
            errorDiv.innerHTML = `<p style="color: red;">Please answer at least one question for each personality trait. You are missing questions for: <strong>${missingScales.join(', ')}</strong>.</p>`;
            errorDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        errorDiv.innerHTML = '';

        const { maxScores, minScores } = calculateMaxMinScores(answeredQuestionsData);
        const thresholds = {};
        for (const scale in maxScores) {
            thresholds[scale] = (maxScores[scale] + minScores[scale]) / 2;
        }

        let finalCode = "";
        const traitPairs = ["Open vs Traditional", "Disciplined vs Spontaneous", "Social vs Reserved", "Easygoing vs Assertive", "Calm vs Passionate"];
        traitPairs.forEach((scaleName, index) => {
            const score = scores[scaleName];
            const threshold = thresholds[scaleName];
            const codes = traitCodeMap[scaleName];

            finalCode += (score > threshold) ? codes.positive : codes.negative;
            if (index < traitPairs.length - 1) {
                finalCode += "-";
            }
        });

        const resultUrl = `/results/${finalCode}/?${params.toString()}`;
        window.location.href = resultUrl;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAndRedirect();
    });

    colorQuestions();
});