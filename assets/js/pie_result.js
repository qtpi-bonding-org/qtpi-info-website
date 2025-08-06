document.addEventListener('DOMContentLoaded', function () {
    // ASSUMPTION: Chart.js library is loaded. The necessary HTML elements (like 'result-page-container')
    // and the window.resultPageData object are assumed to exist.

    const container = document.getElementById('result-page-container');
    const placeholder = document.getElementById('result-placeholder');
    const { code, piePersonalities, traitExplanations, scaleColors, quizQuestions } = window.resultPageData;
    const pieResult = piePersonalities[code];

    const traitNameMap = {
        "Open vs Traditional": { positive: "Open", negative: "Traditional" },
        "Disciplined vs Spontaneous": { positive: "Disciplined", negative: "Spontaneous" },
        "Social vs Reserved": { positive: "Social", negative: "Reserved" },
        "Easygoing vs Assertive": { positive: "Easygoing", negative: "Assertive" },
        "Calm vs Passionate": { positive: "Calm", negative: "Passionate" }
    };

    function calculateScoresFromURL() {
        const params = new URLSearchParams(window.location.search);

        // ** THE FIX IS HERE **
        // Instead of checking for 'q0', we check if there are any parameters at all.
        if (params.toString() === "") {
            return null;
        }

        const scores = { "Social vs Reserved": 0, "Easygoing vs Assertive": 0, "Disciplined vs Spontaneous": 0, "Calm vs Passionate": 0, "Open vs Traditional": 0 };
        const answeredQuestionsData = [];

        quizQuestions.forEach((question, index) => {
            const answerValue = params.get(`q${index}`);
            // This part correctly handles missing questions, only processing the ones that exist.
            if (answerValue) {
                let value = parseInt(answerValue, 10);
                if (question.direction === '-') value = 6 - value;
                scores[question.scale] += value;
                answeredQuestionsData.push({ scale: question.scale });
            }
        });
        return { scores, answeredQuestionsData };
    }

    function calculateMaxMinScores(answeredQuestions) {
        const scaleCounts = {};
        answeredQuestions.forEach(q => { scaleCounts[q.scale] = (scaleCounts[q.scale] || 0) + 1; });
        const maxScores = {}, minScores = {};
        Object.keys(scaleCounts).forEach(scale => {
            maxScores[scale] = scaleCounts[scale] * 5;
            minScores[scale] = scaleCounts[scale] * 1;
        });
        return { maxScores, minScores };
    }

    function render() {
        if (!pieResult) {
            placeholder.innerHTML = `<p>Error: Could not find data for code ${code}.</p>`;
            return;
        }

        const scoreData = calculateScoresFromURL();
        const pieName = pieResult.pieType.toLowerCase();
        const filename = pieName.replace(/ /g, "_") + '.svg';
        const imageUrl = `https://assets.qtpi.app/cutie_pie/${encodeURIComponent(filename)}`;
        const shareUrl = window.location.href;

        if (!scoreData) {
            placeholder.innerHTML = `
                <div class="result-container">
                    <h2>${pieResult.pieType}</h2>
                    <img src="${imageUrl}" alt="${pieResult.pieType}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
                    <p><em>"${pieResult.reasoning}"</em></p>
                    <p>${pieResult.blurb}</p>
                    <hr>
                    <p>This is the general description for the <strong>${pieResult.pieType}</strong>. To get your personalized scores, <a href="/quiz.html">take the quiz!</a></p>
                </div>`;
            return;
        }

        const { scores, answeredQuestionsData } = scoreData;
        const { maxScores } = calculateMaxMinScores(answeredQuestionsData);

        let finalTraitsOutput = "";
        const traitPairs = ["Open vs Traditional", "Disciplined vs Spontaneous", "Social vs Reserved", "Easygoing vs Assertive", "Calm vs Passionate"];
        const displayedCodeArray = code.split('-');

        traitPairs.forEach((scaleName, i) => {
            const letter = displayedCodeArray[i];
            const names = traitNameMap[scaleName];
            const traitName = Object.values(names).find(name => name.startsWith(letter));
            finalTraitsOutput += `<li>You are a **${traitName}** person.</li>`;
        });

        placeholder.innerHTML = `
            <div class="result-container">
                <h2>You are a ${pieResult.pieType}!</h2>
                <img src="${imageUrl}" alt="${pieResult.pieType}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
                <p><em>"${pieResult.reasoning}"</em></p>
                <p>${pieResult.blurb}</p>
                <hr>
                <h3>Your Personality Code: ${code}</h3>
                <ul>${finalTraitsOutput}</ul>
                <h4>Your Trait Scores</h4>
                <canvas id="score-bar-chart" width="400" height="200"></canvas>
                <p><strong>Share your results:</strong></p>
                <div style="margin-bottom: 10px;">
                    <input id="share-url" type="text" value="${shareUrl}" readonly style="width: 100%; padding: 5px;">
                </div>
                <p>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank"><i class="fa-brands fa-x-twitter fa-stack-1x"></i></a>
                    <a href="https://bsky.app/intent/compose?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank"><i class="fa-brands fa-bluesky fa-stack-1x"></i></a>
                    <a href="https://www.threads.net/share?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank"><i class="fa-brands fa-threads fa-stack-1x"></i></a>
                    <a href="https://mastodon.social/share?text=${encodeURIComponent('I got ' + pieResult.pieType + ' on the pie personality quiz! See your result: ' + shareUrl)}" target="_blank"><i class="fa-brands fa-mastodon fa-stack-1x"></i></a>
                    <a href="javascript:void(0);" onclick="navigator.clipboard.writeText('${shareUrl}'); alert('Link copied!');" title="Copy link"><i class="fa-solid fa-copy"></i> Copy</a>
                </p>
            </div>`;

        const ctx = document.getElementById("score-bar-chart").getContext("2d");
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(scores),
                datasets: [{
                    label: 'Your Scores',
                    data: Object.values(scores),
                    backgroundColor: Object.values(scaleColors),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: { x: { beginAtZero: true, max: Math.max(...Object.values(maxScores)) } }
            }
        });
    }

    render();
});