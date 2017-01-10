'use strict';
// Your client side JavaScript code goes here.


$('#addList').click(function() {
    var nameInputList = $('#nameList').val();
    createList(nameInputList, 2, ['bla']).then(function(data) {
        //createList('List', 2, ['testlist', 'testlist1']).then(function (data) {
        console.log('createList', data);
        buildList(data);
    });
});




//neue Karte hinzufügen Button
function addCardButton() {
    $('.addCard').click(function(e) {
        var $col = $(e.target).closest('.column');
        var id = parseInt($col.attr('data-listid'));
        console.log('id ' + id);
        loadSingleList(id).then(function(data) {
                console.log('data ', data);

                var inputTextCard = $col.find('.inputCard').val();
                var cardDiv = $col.find('.cards');
                var appendCard = "<div>" + inputTextCard + "</div>";
                 cardDiv.append(appendCard);
                appendCard.addClass("card");
               
                if (!_.isArray(data.cards)) {
                    data.cards = [inputTextCard];
                } else {
                    data.cards.push(inputTextCard);
                }
                return updateLists(id, data.name, data.pos, data.cards);
            })
            .then(function(list) {
                console.log(list.cards);

                // TODO: make sure the added card is visible in the user interface
            })
    });
}


//allow user to rename LIST
  $('#lists').delegate("h3", "click", function(ev) {
    var $colli = $(ev.target).closest('.column');
    var id = parseInt($colli.attr('data-listid'));
    var input = $("<input>", {
        val: $(this).text(),
        type: "text"
    });
    //input.attr('class', 'listRename');
    $(this).replaceWith(input);
    input.select();
    var saveButton = $('<button>').text('accept').attr('type','submit');
    var rejectButton = $('<button>').text('x').attr('type','submit');
    var thisCard = $colli.find('.cards');
    $(thisCard).prepend(rejectButton);
    $(thisCard).prepend(saveButton);
    
    //loadSingleList(id);
   return $.ajax('/api/lists');

    });

//allow user to rename CARD
  $('#lists').delegate(".card", "click", function(ev) {
    var $colu = $(ev.target).closest('.column');
    var id = parseInt($colu.attr('data-listid'));
    var input = $("<input>", {
        val: $(this).text(),
        type: "text"
    });
    //input.attr('class', 'listRename');
    $(this).replaceWith(input);
    input.select();
    var thatCard = $colu.find('.card');
    var saveButton = $('<button>').text('accept').attr('type','submit');
    var rejectButton = $('<button>').text('x').attr('type','submit');
    $(thatCard).append(rejectButton);
    $(thatCard).prepend(saveButton);
    
    //loadSingleList(id);
   return $.ajax('/api/lists');

    });



/*function turnTextIntoInputField(inputId){
  var inputIdWithHash = "#" + inputId;
  var elementValue = $(inputIdWithHash).text();
  $(inputIdWithHash).replaceWith('<input name="test" id"' + inputId + '"type=text" value="' + elementValue + '">');

  $(document).on('click.' + inputId, function(event){
    if (!$(event.target).closest(inputIdWithHash).length) {
      $(document).off('click.' + inputId);
      var value = $(inputIdWithHash).val();
      $(inputIdWithHash).replaceWith('<p id="' + inputId + '"onclick="turnTextIntoInputField(\'' + inputId + '\')">' + value + '<p>');
      }
  });
}
*/


// This file is included in every page.

// Example code for creating a list on the server
function createList(name, pos, cards) {
    return $.ajax('/api/lists', {
        type: 'POST',
        data: {
            name: name,
            pos: pos,
            cards: cards
        }
    });
}

// Example code for getting all `list`s from server
function loadLists() {
    return $.ajax('/api/lists');
}

function loadSingleList(id) {
    return $.ajax('/api/lists/' + id);
}

function updateLists(id, name, pos, cards) {
    return $.ajax('/api/lists/' + id, {
        type: 'POST',
        data: {
            name: name,
            pos: pos,
            cards: cards
        }
    });
}


function buildList(list) {
    var lists = $('#lists');
    var column = $('<div>').attr('class', 'column').attr('data-listid', list.id);
    var curElem = $('<div>');
    var headline = $('<h3>').text(list.name);
    curElem.append(headline);
    column.append(curElem);
    lists.append(column);


    //Karte hinzufügen

    var inputCard = $('<textarea>').attr('class', 'inputCard');
    var addCard = $('<button>').text('add card...').attr('class', 'addCard').attr('data-listid', list.id);
    addCardButton();
    if (list.cards) {
        var innerUl = $('<div>').attr('class', 'cards');
        list.cards.forEach(function(card) {
            innerUl.append($('<div>').text(card).attr('class', 'card'));
        });
        curElem.append(innerUl);
    }
    curElem.append(inputCard);
    curElem.append(addCard);
}

// Example code for displaying lists in the browser
function displayLists(lists) {
    // Lists should be ordered based on their 'pos' field
    lists.rows = _.sortBy(lists.rows, 'pos');
    lists.rows.forEach(function(list) {
        var listElem = buildList(list);
    });
}


function deleteList(id) {
    return $.ajax('/api/lists/' + id, {
        type: 'DELETE',
    });
} 
/*
// Funktion war glaub schon vorgegeben
function deleteLists(lists) {
    return $.ajax('/:id')
}
*/

// start: execute functions above
loadLists()
    .then(function(data) {
        console.log('Lists', data.rows);
        if (data.rows.length) {
            // If some lists are found display them
            displayLists(data);
        } else {
            // If no lists are found, create sample list
            // and re-display.
            console.log('No lists found, creating one.');
            createList('Your first list', 0, ['Example-card 1', 'Example-card 2', 'my card'])
                .then(function(list) {
                    console.log('Created list', list);
                    return loadLists();
                })
                .then(function(lists) {
                    displayLists(lists);
                })
        }

    });