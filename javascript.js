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




function basicInformationsQuizz() {
    const quizzTitle = document.getElementById("quizzTitle").value
    const urlImgQuizz = document.getElementById("urlImgQuizz").value
    const numberOfQuestions = document.getElementById("numberOfQuestions").value
    const numberOfLevel = document.getElementById("numberOfLevel").value


    if (quizzTitle.length <= 65 && quizzTitle.length >= 20 && numberOfQuestions >= 3 && numberOfLevel >= 2 && urlImgQuizz.indexOf("https://") == 0) {
        document.querySelector(".basic-information-quizz").classList.add("display-none")
        document.querySelector(".quizz-questions").classList.remove("display-none")
        createQuestions(numberOfQuestions, numberOfLevel)
    } else {
        document.querySelector(".informations-input").classList.add("validate")
        if (!(quizzTitle.length <= 65 && quizzTitle.length >= 20)) {
            document.getElementById("titleError").classList.remove("display-none")

        } else {
            document.getElementById("titleError").classList.add("display-none")
        }
        if (!(urlImgQuizz.indexOf("https://") == 0)) {
            document.getElementById("urlError").classList.remove("display-none")
        } else {
            document.getElementById("urlError").classList.add("display-none")
        }
        if (numberOfQuestions < 3) {
            document.getElementById("quizzNumberError").classList.remove("display-none")
        } else {
            document.getElementById("quizzNumberError").classList.add("display-none")
        }
        if (numberOfLevel < 2) {
            document.getElementById("levelNumberError").classList.remove("display-none")
        } else {
            document.getElementById("levelNumberError").classList.add("display-none")
        }

    }
}

function createQuestions(numberOfQuestions, numberOfLevel) {

}

getAllQuizzes()

let globalSelectedQuizz = {};

let globalSelectedQuizzId = 0;

function openQuizz(selectedQuizzId) {
    correctAnswers = 0;

    document.querySelector(".loading-screen").classList.remove("display-none");

    globalSelectedQuizzId = selectedQuizzId;
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${selectedQuizzId}`)
        .then((quizz) => {

            document.querySelector(".loading-screen").classList.add("display-none");

            globalSelectedQuizz = quizz;
            console.log(quizz);

            document.querySelector("main").innerHTML += `<div class="quizz-container"></div>`;
            document.querySelector(".quizz-container").innerHTML += `<div class="quizz-header"></div>`;
            document.querySelector(".quizz-header").innerHTML +=
                `   <span>${quizz.data.title}</span>
                    <img src="${quizz.data.image}">`;

            document.querySelector(".quizz-container").innerHTML += `<div class="quizz-header-background"></div>`;
            document.querySelector(".quizz-container").innerHTML += `<<div class="questions"></div>`;


            let questions = "";
            for (let i = 0; i < quizz.data.questions.length; i++) {
                let answers = quizz.data.questions[i].answers;

                answers.sort(() => { return Math.random() - 0.5; });

                document.querySelector(".questions").innerHTML +=
                    `
                        <div class="question" data-identifier="question">
                            <div class="question-header">
                                <span>${quizz.data.questions[i].title}</span>
                            </div>
                            <div class ="answers"></div>
                        </div>
                    `;
                for (let j = 0; j < answers.length; j++) {
                    document.querySelector(".question:last-of-type .answers").innerHTML +=
                        `
                            <figure class="${answers[j].isCorrectAnswer}" onclick="selectAnswer(this)" data-identifier="answer">
                                <img src="${answers[j].image}">
                                <figcaption>${answers[j].text}</figcaption>
                            </figure>
                        `
                }
            }

        });
}

let correctAnswers = 0;

function selectAnswer(clickedAnswer) {
    clickedAnswer.classList.add("clicked");

    if (clickedAnswer.classList.contains("true")) correctAnswers++;

    let allAnswers = clickedAnswer.parentNode.childNodes;

    clickedAnswer.parentNode.parentNode.classList.add("answered");
    for (let i = 0; i < allAnswers.length; i++) {
        if (i % 2 !== 0) {
            allAnswers[i].classList.add("answered");
        }
    }

    setTimeout(() => {
        document.querySelector(".question:not(.answered)").scrollIntoView({ block: "center", behavior: "smooth" });
    }, 2000)

    endOfQuizz();
}

function endOfQuizz() {
    if (document.querySelectorAll(".clicked").length === document.querySelectorAll(".question").length) {
        let percentage = (correctAnswers / globalSelectedQuizz.data.questions.length) * 100;
        let level = 0;
        for (let i = globalSelectedQuizz.data.levels.length - 1; i >= 0; i--) {
            if (percentage > globalSelectedQuizz.data.levels[i].minValue) {
                level = i;
                break;
            }
        }

        document.querySelector(".quizz-container").innerHTML +=
            `
            <div class="quizz-result" data-identifier="quizz-result">
            <div class="quizz-result-header">${Math.round(percentage)}% de acerto: ${globalSelectedQuizz.data.levels[level].title}</div>
            <div class="quizz-result-content">
                <img src="${globalSelectedQuizz.data.levels[level].image}">
                <span>${globalSelectedQuizz.data.levels[level].text}</span>
            </div>
            <button onclick="restartQuizz()">Reiniciar Quizz</button>
            
            <button onclick="closeQuizz()">Voltar para home</button>
            </div>`;

        setTimeout(() => { document.querySelector(".quizz-result").scrollIntoView({ behavior: "smooth" }); }, 2000);
    }
}

function restartQuizz() {
    document.querySelector(".quizz-container").remove();
    openQuizz(globalSelectedQuizzId);
}

function closeQuizz() {
    document.querySelector(".quizz-container").remove();
}