if (JSON.parse(localStorage.getItem("userCreatedQuizzId")) === null) localStorage.setItem("userCreatedQuizzId", JSON.stringify([-1]));

function createQuizz() {
    const allInputs = document.querySelectorAll("input");
    for (let i = 0; i < allInputs.length; i++) {
        allInputs[i].value = ""
    }
    document.querySelector(".quizz-creation").classList.remove("display-none")
    document.querySelector(".basic-information-quizz").classList.remove("display-none")

}

function getAllQuizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    document.querySelector(".loading-screen").classList.remove("display-none");
    promisse.then(putQuizzes);
}

function putQuizzes(answer) {
    let userCreatedQuizzId = JSON.parse(localStorage.getItem("userCreatedQuizzId"));
    console.log(userCreatedQuizzId);
    document.querySelector(".loading-screen").classList.add("display-none");

    if (userCreatedQuizzId.length > 0) document.querySelector(".user-quizzes").innerHTML += `<h2> Seus Quizzes</h2>`;
    document.querySelector(".all-quizzes").innerHTML += `<h2> Todos os Quizzes</h2>`;

    const quizzes = answer.data
    for (let i = 0; i < quizzes.length; i++) {
        for (let j = 0; j < userCreatedQuizzId.length; j++) {
            if (quizzes[i].id === userCreatedQuizzId[j]) {
                document.querySelector(".user-quizzes").innerHTML +=
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
                break;
            }

            else if (j === (userCreatedQuizzId.length - 1)) {
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
        createQuestions(numberOfQuestions)
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

function createQuestions(numberOfQuestions) {
    const quizzQuestions = document.querySelector(".quizz-questions");
    quizzQuestions.innerHTML = "";
    for (let i = 1; i <= numberOfQuestions; i++) {
        quizzQuestions.innerHTML +=
            `
        <div class="informations-input close">
            <div class="close-questions" onclick="toggleInformations(this)">
                <h2>Pergunta ${i}</h2>
                <ion-icon name="create-outline" class=""></ion-icon>
            </div>
            <div class="questions-informations display-none">
                <input type="text" minlength="20" placeholder="Texto da pergunta" id="question${i}">
                <p>A pergunta deve ter no mínimo 20 caracteres</p>
                <input type="text" pattern="#+[A-Fa-f1-9]{6}" placeholder="Cor de fundo da pergunta" id="questionColor${i}">
                <p>A cor deve ser uma cor em hexadecimal</p>
                <h2>Resposta correta</h2>
                <input type="text" minlength="1" placeholder="Resposta correta" id="correctAnswer${i}">
                <p>Resposta não pode estar em branco</p>
                <input type="url" pattern="https://.*" placeholder="URL da imagem" id="correctAnswerimg${i}">
                <p>O valor informado não é uma URL válida</p>
                <h2>Respostas incorretas</h2>
                <input type="text" minlength="1" placeholder="Resposta incorreta 1" id="wrongAnswer1${i}">
                <input class="url-img" type="url" pattern="https://.*" placeholder="URL da imagem 1" id="wrongAnswer1img${i}">
                <input type="text" placeholder="Resposta incorreta 2" id="wrongAnswer2${i}">
                <input class="url-img" type="url" pattern="https://.*" placeholder="URL da imagem 2" id="wrongAnswer2img${i}">
                <input type="text" placeholder="Resposta incorreta 3" id="wrongAnswer3${i}">
                <input class="url-img" type="url" pattern="https://.*" placeholder="URL da imagem 3" id="wrongAnswer3img${i}">
            </div>  
        </div>
        `
    }
    quizzQuestions.innerHTML +=
        `
    <div class="proceed-button" onclick="levelCreation()">
        <p>Prosseguir pra criar níveis</p>
    </div>
    `
}



function toggleInformations(information) {
    const parentElement = information.parentNode;
    parentElement.classList.toggle("close");
    parentElement.children[1].classList.toggle("display-none")
    information.children[1].classList.toggle("display-none")

}

function levelCreation() {
    document.querySelector(".quizz-questions").classList.add("display-none")
    document.querySelector(".quizz-levels").classList.remove("display-none")
    const quizzLevels = document.querySelector(".quizz-levels");
    const numberOfLevel = document.getElementById("numberOfLevel").value;
    quizzLevels.innerHTML = "";
    for (let i = 1; i <= numberOfLevel; i++) {
        quizzLevels.innerHTML +=
            `
        <div class="informations-input close">
            <div class="close-questions" onclick="toggleInformations(this)">
                <h2>Nível ${i}</h2>
                <ion-icon name="create-outline" class=""></ion-icon>
            </div>
            <div class="levels-informations display-none">
                <input type="text" minlength="10" placeholder="Título do nível" id="levelTitle${i}">
                <input type="text" pattern="^[1-9]?[0-9]{1}$|^100$" placeholder="% de acerto mínima" id="levelPercent${i}">
                <input class="url-img" type="url" pattern="https://.*" placeholder="URL da imagem do nível" id="levelimg${i}">
                <input type="text" minlength="30" placeholder="Descrição do nível" id="levelDescription${i}">
            </div>  
        </div>
    
        `
    }
    quizzLevels.innerHTML +=
        `
    <div class="proceed-button" onclick="sendQuizzToServer()">
        <p>Finalizar Quizz</p>
    </div>
    `
}

function sendQuizzToServer() {
    let allDoneQuizz = {
        title: document.getElementById("quizzTitle").value,
        image: document.getElementById("urlImgQuizz").value,
        questions: [],
        levels: []
    }

    for (let i = 0; i < document.getElementById("numberOfQuestions").value; i++) {

        allDoneQuizz.questions[i] = {
            title: document.getElementById(`question${i + 1}`).value,
            color: document.getElementById(`questionColor${i + 1}`).value,
            answers: [{
                text: document.getElementById(`correctAnswer${i + 1}`).value,
                image: document.getElementById(`correctAnswerimg${i + 1}`).value,
                isCorrectAnswer: true
            },
            {
                text: document.getElementById(`wrongAnswer1${i + 1}`).value,
                image: document.getElementById(`wrongAnswer1img${i + 1}`).value,
                isCorrectAnswer: false
            },
            {
                text: document.getElementById(`wrongAnswer2${i + 1}`).value,
                image: document.getElementById(`wrongAnswer2img${i + 1}`).value,
                isCorrectAnswer: false
            },
            {
                text: document.getElementById(`wrongAnswer3${i + 1}`).value,
                image: document.getElementById(`wrongAnswer3img${i + 1}`).value,
                isCorrectAnswer: false
            }
            ]
        }
    }


    for (let i = 0; i < document.getElementById("numberOfLevel").value; i++) {
        allDoneQuizz.levels[i] = {
            title: document.getElementById(`levelTitle${i + 1}`).value,
            image: document.getElementById(`levelimg${i + 1}`).value,
            text: document.getElementById(`levelDescription${i + 1}`).value,
            minValue: document.getElementById(`levelPercent${i + 1}`).value
        }


    }
    console.log(allDoneQuizz)
    document.querySelector(".loading-screen").classList.remove("display-none");
    promisse = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", allDoneQuizz)
    promisse.then(finishQuizz)
    promisse.catch(error)

}

function error(erro) {
    console.log("o erro foi = " + erro.value)
}

function finishQuizz(serverAnswer) {

    document.querySelector(".loading-screen").classList.add("display-none");
    document.querySelector(".quizz-levels").classList.add("display-none")
    document.querySelector(".quizz-finish").classList.remove("display-none")
    const quizzTitle = document.getElementById("quizzTitle").value
    const urlImgQuizz = document.getElementById("urlImgQuizz").value
    document.querySelector(".quizz-finish").innerHTML = "";
    document.querySelector(".quizz-finish").innerHTML +=
        `
    <div class="quizz">
        <div class="background">

        </div>
        <img src="${urlImgQuizz}">
        <div class="title">
            <p>${quizzTitle}</p>
        </div>
    </div>
    <div class="proceed-button" onclick="openQuizz(${serverAnswer.data.id})">
        <p>Acessar Quizz</p>
    </div>
    <p class = "go-to-home-button" onclick="goToHome()">Voltar pra home</p>
    `

    addUserCreatedQuizz(serverAnswer.data.id);
}


function addUserCreatedQuizz(id) {
    let userCreatedQuizzId = [];


    userCreatedQuizzId = JSON.parse(localStorage.getItem("userCreatedQuizzId"));

    userCreatedQuizzId.push(id);

    console.log(userCreatedQuizzId);

    let stringfieduserCreatedQuizzId = JSON.stringify(userCreatedQuizzId);

    console.log(stringfieduserCreatedQuizzId);

    localStorage.setItem("userCreatedQuizzId", stringfieduserCreatedQuizzId);
}

function goToHome() {
    document.querySelector(".quizz-finish").classList.add("display-none")
    document.querySelector(".quizz-creation").classList.add("display-none")
}

getAllQuizzes()

let globalSelectedQuizz = {};

let globalQuizzId = 0;

function openQuizz(quizzId) {
    correctAnswers = 0;
    console.log(quizzId);
    document.querySelector(".loading-screen").classList.remove("display-none");

    globalQuizzId = quizzId;
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`)
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

            for (let i = 0; i < quizz.data.questions.length; i++) {
                let answers = quizz.data.questions[i].answers;

                answers.sort(() => { return Math.random() - 0.5; });

                document.querySelector(".questions").innerHTML +=
                    `
                        <div class="question" data-identifier="question">
                            <div class="question-header" style="background-color: ${quizz.data.questions[i].color}">
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
    openQuizz(globalQuizzId);
}

function closeQuizz() {
    document.querySelector(".quizz-container").remove();

}

//inputElement.checkValidity() returns true or false