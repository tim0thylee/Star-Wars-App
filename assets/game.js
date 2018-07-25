$(document).ready(function(){

    const characterObject = {
        "Obi-Wan Kenobi": {
            name: "Obi-Wan Kenobi",
            health: 100,
            attack: 10,
            image: "./assets/images/obiwan.jpg",
            returnAttack: 20
        },
        "Luke Skywalker": {
            name: "Luke Skywalker",
            health: 110,
            attack: 7,
            image: "./assets/images/luke.jpg",
            returnAttack: 17
        },
        "Darth Maul": {
            name: "Darth Maul",
            health: 140,
            attack: 5,
            image: "./assets/images/darthmaul.jpg",
            returnAttack: 18
        },
        "Qui-Gon Jinn": {
            name: "Qui-Gon Jinn",
            health: 90,
            attack: 12,
            image: "./assets/images/Qui-Gon-Jinn.jpeg",
            returnAttack: 19
        }
    };

    let attacker;
    let charactersNotChosen = [];
    let defender;
    let turnNumber = 1;
    let defeated = 0;
    //this section is to get all the cards loaded onto the pick player screen. 
    var showCharacter = function(character, area){
        let characterDiv = $(`<div class="col sm12 m3 character" data-name="${character.name}">`);
        let cardDiv = $(`<div class = "card">`);
        //creating nested div for card image
        let imageCard = $(`<div class="card-image">`);
        let characterName =$(`<span class="character-name card-title">`).text(character.name);
        let characterImage = $(`<img alt="image" class="character-image">`).attr("src", character.image);
        imageCard.append(characterName).append(characterImage);
        //creating nested div for the card content
        let cardContent = $(`<div class="card-content">`)
        let characterHealth = $(`<div class="character-health">`).text(`Health: ${character.health}`);
        cardContent.append(characterHealth);
        // appending image and content to the cardDiv
        cardDiv.append(imageCard).append(cardContent);
        // appending carddiv to the characterDiv
        characterDiv.append(cardDiv);
        $(area).append(characterDiv);
    }
    //this function is to load the game with the character object
    let loadGame = function() {
        for (let key in characterObject) {
            showCharacter(characterObject[key], "#character-choice")
        }
    }
    // this function is to empty the message div. 
    const emptyFightInfoDiv = () => {
        const message = $("#fight-information");
        message.text("")
    }
    //loading the initial character cards
    loadGame();
    //this code here is when we click on a character, we will append that character to the chosen character div. 
    //then, we will append the rest ofo the enemies to the enemies div. 
    $("#character-choice").on("click", ".character", function() {
        
        let chosenCharacter = $(this).attr("data-name");
        
        if(!attacker) {
            attacker = characterObject[chosenCharacter];
            
            for (let key in characterObject) {
                if (key !== chosenCharacter) {
                    charactersNotChosen.push(characterObject[key]);
                };
            };
        };
        //hide the array from character choice
        $("#character-choice").hide();
        //this function will add to the chosen character div
        const chosenCharacterAppend = () => {
            $("#chosen-character").empty();
            showCharacter(attacker, "#chosen-character")
        };
        // this function will add the rest of the none chosen charactes to the enmies div. 
        const appendRestOfCharacters = () => {
            $("#enemies").empty();
            //looping through each enemy, and appending to the enemies section. 
            charactersNotChosen.forEach((enemies) => {
                showCharacter(enemies, "#enemies");
            });
        };
        chosenCharacterAppend();
        appendRestOfCharacters();
        
    });
    //this is where we append the defender to the enemy section. 
    $("#enemies").on("click", ".character", function () {
        let chosenEnemy = $(this).attr("data-name");

        if($("#defender").children().length === 0) {
            defender = characterObject[chosenEnemy]
            showCharacter(defender, "#defender");
            //here, we remove the character card we have chosen. 
            $(this).remove();
        }
    });

    $("#attack-button").on("click", function() {

        //we check here to make sure we actually chose a defender before movivng on. 
        if($("#defender").children().length !== 0){
            //we decrease health of both attacker and defener here, and multiply the attack by the turn number. 
            defender.health -= attacker.attack * turnNumber;
            //here, we are going to post the stats of the fighters
            emptyFightInfoDiv();
            let showFightMessage = $("<div id='you-win-text'>").text(`${attacker.name} did ${attacker.attack * turnNumber} damage! But, ${defender.name} did ${defender.returnAttack} damage in return...`);
            $("#fight-information").append(showFightMessage);

            //if the defender health is still over 0, we are going to return an attack to the attacker.
            if(defender.health > 0) {
                // here, we empty the defender div to re-render the character card with updated health. 
                $("#defender").empty();
                showCharacter(defender, "#defender");
                //we decrease health of the attacker
                attacker.health -= defender.returnAttack;

                $("#chosen-character").empty();
                showCharacter(attacker, "#chosen-character");
                
                emptyFightInfoDiv();
                let showFightMessage = $("<div id='you-win-text'>").text(`${attacker.name} did ${attacker.attack * turnNumber} damage! But, ${defender.name} did ${defender.returnAttack} damage in return...`);
                $("#fight-information").append(showFightMessage);

                if(attacker.health <= 0) {
                    emptyFightInfoDiv();
                    const pickDefenderMessage = $("<div id='you-win-text'>").text("You lose.... Press the restart button to try again.");
                    const restartButton = $("<a id='restart-button' class='waves-effect waves-light btn'>").text("Restart")
                    $("#fight-information").append(pickDefenderMessage).append(restartButton);
                    //restart button to reload the page. 
                    $("#restart-button").on("click", function() {
                        location.reload(true);
                    })
                }
            }else {
                //empy defender div once defeated and increase defeated by 1. 
                $("#defender").empty();
                defeated++
                if(defeated === 3) {
                    emptyFightInfoDiv();
                    const pickDefenderMessage = $("<div id='you-win-text'>").text("You win! Press the restart button to play again.");
                    const restartButton = $("<a id='restart-button' class='waves-effect waves-light btn'>").text("Restart")
                    $("#fight-information").append(pickDefenderMessage).append(restartButton);
                    //restart button to reload the page. 
                    $("#restart-button").on("click", function() {
                        location.reload(true);
                    })
                }
            }

            turnNumber++
        } else {
            emptyFightInfoDiv();
            const pickDefenderMessage = $("<div id='you-win-text'>").text("Pick a defender!");
            $("#fight-information").append(pickDefenderMessage);
        }

    });
    

    
    

})
