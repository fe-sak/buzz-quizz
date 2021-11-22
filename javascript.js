if (localStorage.getItem("userCreatedQuizzes") === null) localStorage.setItem("userCreatedQuizzes", JSON.stringify([]));

let isEdit = false

function createQuizz() {
    const allInputs = document.querySelectorAll("input");
    if (!isEdit) {
        for (let i = 0; i < allInputs.length; i++) {
            allInputs[i].value = ""
        }
    }
    document.querySelector(".all-quizzes").classList.add("display-none")
    document.querySelector(".quizz-creation").classList.remove("display-none")
    document.querySelector(".basic-information-quizz").classList.remove("display-none")

}

function getAllQuizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    document.querySelector(".loading-screen").classList.remove("display-none");
    promisse.then(putQuizzes);
}

function putQuizzes(answer) {
    let userCreatedQuizzesId = [];

    for (let i = 0; i < userCreatedQuizzes.length; i++) {
        userCreatedQuizzesId.push(userCreatedQuizzes[i].id);
    }
    let counter = 0;

    document.querySelector(".loading-screen").classList.add("display-none");

    document.querySelector(".all-quizzes-title").innerHTML = `<h2> Todos os Quizzes</h2>`;

    const quizzes = answer.data

    document.querySelector(".all-quizzes").innerHTML = "";
    document.querySelector(".user-quizzes").innerHTML = "";
    if (userCreatedQuizzesId.length === 0) {
        for (let i = 0; i < quizzes.length; i++) {
            document.querySelector(".all-quizzes").innerHTML +=
                `
                <div class="quizz" id=${quizzes[i].id} onclick="openQuizz(this.id)">
                    <div class="background"></div>
                <img src="${quizzes[i].image}">
                <div class="title">
                    <p>${quizzes[i].title}</p>
                </div>
                </div>
            `
        }
    } else {
        for (let i = 0; i < quizzes.length; i++) {
            for (let j = 0; j < userCreatedQuizzesId.length; j++) {
                if (quizzes[i].id === userCreatedQuizzesId[j]) {
                    document.querySelector(".user-quizzes").innerHTML +=
                        `
                            
                            <div class="quizz" id=${quizzes[i].id} onclick="openQuizz(this.id)">
                                <div class="background">
                                    <div class="buttons">
                                        <button onclick="editQuizz(this)">
                                            <ion-icon name="create-outline"></ion-icon>
                                        </button>
                                        <button onclick="deleteQuizz(this)">
                                            <ion-icon name="trash-outline"></ion-icon>
                                        </button>
                                    </div>
                                </div>
                                <img src="${quizzes[i].image}">
                                <div class="title">
                                    <p>${quizzes[i].title}</p>
                                </div>
                            </div>
                        `
                    counter++;
                    break;
                } else if (j === (userCreatedQuizzesId.length - 1)) {
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


    if (userCreatedQuizzesId.length > 0) {
        document.querySelector(".user-quizzes-title").innerHTML =
            `
        <h2> Seus Quizzes</h2>
        <div class="new-create-quizz-button">
        <ion-icon name="add-circle-sharp" onclick="createQuizz()"></ion-icon>
        </div>
        `;
        document.querySelector(".create-quizz").classList.add("display-none");

    }

    if (counter === 0 && userCreatedQuizzesId.length > 0) {
        document.querySelector(".user-quizzes").innerHTML = `<span> O servidor não enviou seus quizzes criados devido a grande quantidade de quizzes criados por outros usuários :( </span>`;
    }

    if (document.querySelector(".buttons") !== null) {
        let buttons = document.querySelectorAll(".buttons");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }

    }
}


function basicInformationsQuizz() {
    const quizzTitle = document.getElementById("quizzTitle").value
    const urlImgQuizz = document.getElementById("urlImgQuizz").value
    const numberOfQuestions = document.getElementById("numberOfQuestions").value
    const numberOfLevel = document.getElementById("numberOfLevel").value

    document.querySelector(".quizz-levels").classList.add("display-none")
    if (quizzTitle.length <= 65 && quizzTitle.length >= 20 && numberOfQuestions >= 3 && numberOfLevel >= 2 && urlImgQuizz.indexOf("https://") == 0) {
        document.querySelector(".basic-information-quizz").classList.remove("validate")
        document.querySelector(".basic-information-quizz").classList.add("display-none")
        document.querySelector(".quizz-questions").classList.remove("display-none")
        createQuestions(numberOfQuestions)
    } else {
        document.querySelector(".basic-information-quizz").classList.add("validate")
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

    if (!isEdit) {

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
                    <input type="text" minlength="20" placeholder="Texto da pergunta" id="question${i}" required>
                    <p class="display-none">A pergunta deve ter no mínimo 20 caracteres</p>
                    <input type="text" <input type="text" pattern="#+[A-Fa-f0-9]{6}" placeholder="Cor de fundo da pergunta" id="questionColor${i}" required>
                    <p class="display-none">A cor deve ser uma cor em hexadecimal</p>
                    <h2>Resposta correta</h2>
                    <input type="text" minlength="1" placeholder="Resposta correta" id="correctAnswer${i}" required>
                    <p class="display-none">Resposta não pode estar em branco</p>
                    <input type="url" pattern="https://.*" placeholder="URL da imagem" id="correctAnswerimg${i}" required>
                    <p class="display-none">O valor informado não é uma URL válida</p>
                    <h2>Respostas incorretas</h2>
                    <input type="text" minlength="1" placeholder="Resposta incorreta 1" id="wrongAnswer1${i}" required>
                    <p class="display-none">Resposta não pode estar em branco</p>
                    <input class="url-img" type="url" pattern="https://.*" placeholder="URL da imagem 1" id="wrongAnswer1img${i}" required>
                    <p class="display-none">O valor informado não é uma URL válida</p>
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
}




function toggleInformations(information) {
    const parentElement = information.parentNode;
    parentElement.classList.toggle("close");
    parentElement.children[1].classList.toggle("display-none")
    information.children[1].classList.toggle("display-none")

}

function levelCreation() {
    let allvalidateQuestions = true;
    let validateQuestions;

    const quizzLevels = document.querySelector(".quizz-levels");
    const numberOfLevel = document.getElementById("numberOfLevel").value;


    for (let i = 1; i <= document.getElementById("numberOfQuestions").value; i++) {
        if (document.getElementById(`question${i}`).checkValidity()) {
            document.getElementById(`question${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`question${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`questionColor${i}`).checkValidity()) {
            document.getElementById(`questionColor${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`questionColor${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`correctAnswer${i}`).checkValidity()) {
            document.getElementById(`correctAnswer${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`correctAnswer${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`correctAnswerimg${i}`).checkValidity()) {
            document.getElementById(`correctAnswerimg${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`correctAnswerimg${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`wrongAnswer1${i}`).checkValidity()) {
            document.getElementById(`wrongAnswer1${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`wrongAnswer1${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`wrongAnswer1img${i}`).checkValidity()) {
            document.getElementById(`wrongAnswer1img${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`wrongAnswer1img${i}`).nextElementSibling.classList.remove("display-none")
        }
        validateQuestions = document.getElementById(`question${i}`).checkValidity() &&
            document.getElementById(`questionColor${i}`).checkValidity() &&
            document.getElementById(`correctAnswer${i}`).checkValidity() &&
            document.getElementById(`correctAnswerimg${i}`).checkValidity() &&
            document.getElementById(`wrongAnswer1${i}`).checkValidity() &&
            document.getElementById(`wrongAnswer1img${i}`).checkValidity();
        allvalidateQuestions = validateQuestions && allvalidateQuestions;
    }

    if (allvalidateQuestions) {
        document.querySelector(".quizz-questions").classList.remove("validate")
        document.querySelector(".quizz-questions").classList.add("display-none")

    } else {
        document.querySelector(".quizz-questions").classList.add("validate")


    }
    if (!isEdit) {
        document.querySelector(".quizz-questions").classList.add("validate")
        document.querySelector(".quizz-levels").classList.add("display-none")

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
                        <input type="text" minlength="10" placeholder="Título do nível" id="levelTitle${i}" required>
                        <p class="display-none">O título deve ter no mínimo 10 caracteres</p>
                        <input type="text" pattern="^[1-9]?[0-9]{1}$|^100$" placeholder="% de acerto mínima" id="levelPercent${i}" required>
                        <p class="display-none">O número deve estar entre 0-100</p>
                        <input class="url-img" type="url" pattern="https://.*" placeholder="URL da imagem do nível" id="levelimg${i}" required>
                        <p class="display-none">O valor informado não é uma URL válida</p>
                        <input type="text" minlength="30" placeholder="Descrição do nível" id="levelDescription${i}" required>
                        <p class="display-none">A descrição deve ter no mínimo 30 caracteres</p>
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
    document.querySelector(".quizz-levels").classList.remove("display-none")
}


function sendQuizzToServer() {
    let allvalidateLevels = true;
    let validateLevels;
    for (let i = 1; i <= document.getElementById("numberOfLevel").value; i++) {
        if (document.getElementById(`levelTitle${i}`).checkValidity()) {
            document.getElementById(`levelTitle${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`levelTitle${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`levelPercent${i}`).checkValidity()) {
            document.getElementById(`levelPercent${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`levelPercent${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`levelimg${i}`).checkValidity()) {
            document.getElementById(`levelimg${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`levelimg${i}`).nextElementSibling.classList.remove("display-none")
        }
        if (document.getElementById(`levelDescription${i}`).checkValidity()) {
            document.getElementById(`levelDescription${i}`).nextElementSibling.classList.add("display-none")
        } else {
            document.getElementById(`levelDescription${i}`).nextElementSibling.classList.remove("display-none")
        }
        validateLevels = document.getElementById(`question${i}`).checkValidity() &&
            document.getElementById(`levelTitle${i}`).checkValidity() &&
            document.getElementById(`levelPercent${i}`).checkValidity() &&
            document.getElementById(`levelimg${i}`).checkValidity() &&
            document.getElementById(`levelDescription${i}`).checkValidity();
        allvalidateLevels = validateLevels && allvalidateLevels;
    }

    if (allvalidateLevels) {
        document.querySelector(".quizz-levels").classList.remove("validate")
        let key = ""
        let allDoneQuizz = {
            title: document.getElementById("quizzTitle").value,
            image: document.getElementById("urlImgQuizz").value,
            questions: [],
            levels: [],


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
            if (allDoneQuizz.questions[i].answers[3].text == "") {
                allDoneQuizz.questions[i].answers.pop()
            }
            if (allDoneQuizz.questions[i].answers[2].text == "") {
                allDoneQuizz.questions[i].answers.pop()
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
        document.querySelector(".loading-screen").classList.remove("display-none");
        console.log(allDoneQuizz)
        if (isEdit) {

            for (let i = 0; i < userCreatedQuizzes.length; i++) {
                if (id == userCreatedQuizzes[i].id) key = userCreatedQuizzes[i].key
            }

            allDoneQuizz.headers.push({ "Secret-Key": key, })
            console.log(allDoneQuizz)
            promisse = axios.put(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`, allDoneQuizz)
            promisse.then(goToHome)
        } else {
            promisse = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", allDoneQuizz)
            promisse.then(finishQuizz)

        }

    } else {
        document.querySelector(".quizz-levels").classList.add("validate")
    }
}

function finishQuizz(serverAnswer) {
    console.log(serverAnswer);
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
        <div class="title">
            <p>${quizzTitle}</p>
        </div>

        </div>
        <img src="${urlImgQuizz}">
    </div>
    <div class="proceed-button" onclick="openQuizz(${serverAnswer.data.id})">
        <p>Acessar Quizz</p>
    </div>
    <p class = "go-to-home-button" onclick="goToHome()">Voltar pra home</p>
    `

    addUserCreatedQuizz(serverAnswer.data.id, serverAnswer.data.key);
}


function addUserCreatedQuizz(id, key) {
    userCreatedQuizzes.push({
        id,
        key
    });

    console.log(userCreatedQuizzes);
    localStorage.setItem("userCreatedQuizzes", JSON.stringify(userCreatedQuizzes));
}

function goToHome() {
    getAllQuizzes();
    document.querySelector(".all-quizzes").classList.remove("display-none")
    document.querySelector(".quizz-finish").classList.add("display-none");
    document.querySelector(".quizz-creation").classList.add("display-none");
    document.querySelector(".quizz-container").remove();
    document.querySelector(".loading-screen").classList.remove("display-none");
}

getAllQuizzes();

let globalSelectedQuizz = {};

let globalQuizzId = 0;

function openQuizz(quizzId) {
    correctAnswers = 0;
    document.querySelector(".loading-screen").classList.remove("display-none");
    document.querySelector(".quizz-finish").classList.add("display-none")
    document.querySelector(".quizz-creation").classList.add("display-none")

    globalQuizzId = quizzId;
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizzId}`)
        .then((quizz) => {

            document.querySelector(".loading-screen").classList.add("display-none");

            globalSelectedQuizz = quizz;

            document.querySelector("main").innerHTML += `<div class="quizz-container"></div>`;
            document.querySelector(".quizz-container").innerHTML += `<div class="quizz-header"></div>`;
            document.querySelector(".quizz-header").innerHTML +=
                `   <span>${quizz.data.title}</span>
                    <img src="${quizz.data.image}">`;

            document.querySelector(".quizz-container").innerHTML += `<div class="quizz-header-background"></div>`;
            document.querySelector(".quizz-container").innerHTML += `<div class="questions"></div>`;

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
            
            <button onclick="goToHome()()">Voltar para home</button>
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

let userCreatedQuizzes = [];

userCreatedQuizzes = JSON.parse(localStorage.getItem("userCreatedQuizzes"));

// Bônus
let id;

function editQuizz(button) {
    id = button.parentNode.parentNode.parentNode.id;

    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + id)
    promisse.then(getQuizzInformation)
}

function getQuizzInformation(answer) {
    const allInputs = document.querySelectorAll("input");

    for (let i = 0; i < allInputs.length; i++) {
        allInputs[i].value = ""
    }

    document.getElementById("quizzTitle").value = answer.data.title
    document.getElementById("urlImgQuizz").value = answer.data.image
    document.getElementById("numberOfQuestions").value = answer.data.questions.length
    document.getElementById("numberOfLevel").value = answer.data.levels.length
    createQuestions(answer.data.questions.length)
    for (let i = 0; i < answer.data.questions.length; i++) {

        document.getElementById(`question${i + 1}`).value = answer.data.questions[i].title
        document.getElementById(`questionColor${i + 1}`).value = answer.data.questions[i].color

        document.getElementById(`correctAnswer${i + 1}`).value = answer.data.questions[i].answers[0].text
        document.getElementById(`correctAnswerimg${i + 1}`).value = answer.data.questions[i].answers[0].image

        document.getElementById(`wrongAnswer1${i + 1}`).value = answer.data.questions[i].answers[1].text
        document.getElementById(`wrongAnswer1img${i + 1}`).value = answer.data.questions[i].answers[1].image
        if (answer.data.questions[i].answers[2]) {
            document.getElementById(`wrongAnswer2${i + 1}`).value = answer.data.questions[i].answers[2].text
            document.getElementById(`wrongAnswer2img${i + 1}`).value = answer.data.questions[i].answers[2].image
        }
        if (answer.data.questions[i].answers[3]) {
            document.getElementById(`wrongAnswer3${i + 1}`).value = answer.data.questions[i].answers[3].text
            document.getElementById(`wrongAnswer3img${i + 1}`).value = answer.data.questions[i].answers[3].image
        }
        levelCreation()
        for (let i = 0; i < answer.data.levels.length; i++) {
            document.getElementById(`levelTitle${i + 1}`).value = answer.data.levels[i].title
            document.getElementById(`levelimg${i + 1}`).value = answer.data.levels[i].image
            document.getElementById(`levelDescription${i + 1}`).value = answer.data.levels[i].text
            document.getElementById(`levelPercent${i + 1}`).value = answer.data.levels[i].minValue
        }

    }

    isEdit = true;
    createQuizz();
    alert("id = " + id + "\nkey = " + key)
    console.log(answer.data)


}


function deleteQuizz(button) {
    let id = button.parentNode.parentNode.parentNode.id;

    let key = "";

    for (let i = 0; i < userCreatedQuizzes.length; i++) {
        if (id == userCreatedQuizzes[i].id) key = userCreatedQuizzes[i].key
    }

    console.log(key);
}

if (window.confirm("Deseja deletar este quizz? Esta ação não pode ser desfeita")) {
    axios.delete(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`, {
            headers: {
                "Secret-Key": key,
            }
        })
        .then(getAllQuizzes);
}

}