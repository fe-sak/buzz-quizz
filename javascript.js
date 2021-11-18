function createQuizz() {
    document.querySelector(".quizz-creation").classList.remove("display-none")
}

function getAllQuizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promisse.then(putQuizzes);
}

function putQuizzes(answer) {
    const quizzes = answer.data
    for (let i = 0; i < quizzes.length; i++) {
        document.querySelector(".all-quizzes").innerHTML +=
            `
        <div class="quizz" id=${quizzes[i].id} onclick="openQuizz(this.id)">
        <div class="background">
                    
        </div>
            <img src="${quizzes[i].image}">
            <div class="title">
                <p>${quizzes[i].title}</p>
            </div>
        </div>
        `
    }

}

getAllQuizzes()

function openQuizz(selectedQuizzId) {
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${selectedQuizzId}`)
        .then((quizz) => {
            console.log(quizz);

            let questions = "";
            for (let i = 0; i < quizz.data.questions.length; i++) {
                let answers = quizz.data.questions[i].answers;

                answers.sort(() => { return Math.random() - 0.5; });

                console.log(answers);

                let question = `
                        <div class="question">
                            <div class="question-header">
                                <span>${quizz.data.questions[i].title}</span>
                            </div>
                            
                            <div class="answers">
                                <figure class="answer ${answers[0].isCorrectAnswer}" onclick="selectAnswer(this)">
                                    <img src="${answers[0].image}">
                                    <figcaption>${answers[0].text}</figcaption>
                                </figure>
                                <figure class="answer ${answers[1].isCorrectAnswer}" onclick="selectAnswer(this)">
                                    <img src="${answers[1].image}">
                                    <figcaption>${answers[1].text}</figcaption>
                                </figure>
                                <figure class="answer ${answers[2].isCorrectAnswer}" onclick="selectAnswer(this)">
                                    <img src="${answers[2].image}">
                                    <figcaption>${answers[2].text}</figcaption>
                                </figure>
                                <figure class="answer ${answers[3].isCorrectAnswer}" onclick="selectAnswer(this)">
                                    <img src="${answers[3].image}">
                                    <figcaption>${answers[3].text}</figcaption>
                                </figure>
                            </div>
                        </div>
                        `;

                questions = questions.concat(question);
            }

            document.querySelector("main").innerHTML +=
                `
                <div class="quizz-container">
                    <div class="quizz-header">
                        <span>${quizz.data.title}</span>
                        <img src="${quizz.data.image}">
                        </div>
                    <div class="quizz-header-background"></div>
                    <div class="questions">
                    ${questions}
                    </div>
                </div>`;

        });
}

let correctAnswers = 0;

function selectAnswer(clickedAnswer) {
    if (clickedAnswer.classList.contains("true")) correctAnswers++;
    let allAnswers = clickedAnswer.parentNode.childNodes;

    clickedAnswer.parentNode.parentNode.classList.add("selected");
    for (let i = 0; i < allAnswers.length; i++) {
        if (i % 2 !== 0) {
            console.log(allAnswers[i]);
            allAnswers[i].classList.add("selected");
        }
    }

    setTimeout(() => {
        document.querySelector(".question:not(.selected)").scrollIntoView({ block: "center", behavior: "smooth" });
    }, 2000)
}