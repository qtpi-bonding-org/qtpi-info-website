document.addEventListener('DOMContentLoaded', function () {
    // ASSUMPTION: The Chart.js library is loaded on this page.
    // The data objects are assumed to exist in the global scope.
    const pieData = window.personalityData.piePersonalities;
    const traitExplanations = window.personalityData.traitExplanations;
    const scaleColors = window.personalityData.scaleColors;

    const traitCodeMap = {
        "Open vs Traditional": { positive: "O", negative: "T" },
        "Disciplined vs Spontaneous": { positive: "D", negative: "S" },
        "Social vs Reserved": { positive: "O", negative: "R" },
        "Easygoing vs Assertive": { positive: "E", negative: "A" },
        "Calm vs Passionate": { positive: "C", negative: "P" }
    };

    const traitNameMap = {
        "Open vs Traditional": { positive: "Open", negative: "Traditional" },
        "Disciplined vs Spontaneous": { positive: "Disciplined", negative: "Spontaneous" },
        "Social vs Reserved": { positive: "Social", negative: "Reserved" },
        "Easygoing vs Assertive": { positive: "Easygoing", negative: "Assertive" },
        "Calm vs Passionate": { positive: "Calm", negative: "Passionate" }
    };

    function renderChartFromURL() {
        const quizQuestionsData = window.quizQuestionsData;
        const params = new URLSearchParams(window.location.search);

        const scores = {
            "Social vs Reserved": 0,
            "Easygoing vs Assertive": 0,
            "Disciplined vs Spontaneous": 0,
            "Calm vs Passionate": 0,
            "Open vs Traditional": 0
        };

        const answeredQuestionsData = [];

        quizQuestionsData.forEach((question, index) => {
            const value = params.get(`q${index}`);
            if (value) {
                const scale = question.scale;
                const direction = question.direction;
                let parsedValue = parseInt(value, 10);
                if (direction === '-') parsedValue = 6 - parsedValue;
                if (scale) {
                    scores[scale] += parsedValue;
                    answeredQuestionsData.push({ scale, direction });
                }
            }
        });

        const ctx = document.getElementById("score-bar-chart").getContext("2d");
        const traitLabels = Object.keys(scores);
        const traitScores = Object.values(scores);
        const { maxScores } = calculateMaxMinScores(answeredQuestionsData);
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

    function updateShareLinks() {
        const shareUrl = window.location.href;
        const pieType = window.pieResult.pieType;
        const encodedText = encodeURIComponent(`I got ${pieType} on the pie personality quiz! See your result: `);

        document.getElementById('share-url').value = shareUrl;

        document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${encodedText}${encodeURIComponent(shareUrl)}`;
        document.getElementById('bsky-share').href = `https://bsky.app/intent/compose?text=${encodedText}${encodeURIComponent(shareUrl)}`;
        document.getElementById('threads-share').href = `https://www.threads.net/share?text=${encodedText}${encodeURIComponent(shareUrl)}`;
        document.getElementById('mastodon-share').href = `https://mastodon.social/share?text=${encodedText}${encodeURIComponent(shareUrl)}`;

        const copyButton = document.getElementById('copy-link');
        copyButton.addEventListener('click', function (event) {
            // This is the fix: prevent the default navigation behavior of the <a> tag.
            event.preventDefault();
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link copied!');
            });
        });
    }

    renderChartFromURL();
    updateShareLinks();
});